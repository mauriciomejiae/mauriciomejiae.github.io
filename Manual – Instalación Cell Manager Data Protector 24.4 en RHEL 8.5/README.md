# Manual – Instalación Cell Manager Data Protector 24.4 en RHEL 8.5

![Status](https://img.shields.io/badge/Status-Migrado-success?style=flat-square)
![Type](https://img.shields.io/badge/Type-Manual_Técnico-blue?style=flat-square)
![Last Updated](https://img.shields.io/badge/Date-2026-lightgrey?style=flat-square)

---

**Manual – Instalación Cell Manager Data Protector 24.4 en RHEL 8.5**

**Paso 1: Configurar IP estática y desactivar IPv6 (cambios permanentes)**

**– Identificar la interfaz de red activa**

ip -o link show \| awk -F': ' '{print \$2}' \| grep -v lo

Este comando lista las interfaces de red disponibles, excluyendo la loopback (lo).

**Ejemplo de salida:**

enp6s18

**– Configurar IP estática, gateway, DNS y desactivar IPv6**

sudo nmcli con mod enp6s18 ipv4.addresses 192.168.2.6/24 \\

ipv4.gateway 192.168.2.1 \\

ipv4.dns "8.8.8.8 8.8.4.4" \\

ipv4.method manual \\

ipv6.method ignore

Este comando asigna una IP estática, desactiva DHCP e IPv6, y configura DNS y gateway.

**– Activar la conexión para aplicar los cambios**

sudo nmcli con up enp6s18

Reinicia la interfaz de red enp6s18 para aplicar la nueva configuración.

**– Verificar configuración de IP**

ip a show enp6s18

nmcli dev show enp6s18 \| grep IP

Asegura que la IP 192.168.2.6 esté activa y que no haya direcciones IPv6.

**Paso 2: Configurar nombre de máquina y actualizar /etc/hosts**

**– Establecer el nombre de host permanente**

sudo hostnamectl set-hostname cellmanager.homelab.local

Esto configura el hostname del sistema de forma persistente en todos los reinicios.

**– Agregar la IP, FQDN y hostname corto al archivo /etc/hosts**

echo "192.168.2.6 cellmanager.homelab.local cellmanager" \| sudo tee -a /etc/hosts

Esto permite la resolución local del nombre de host y su FQDN hacia la IP estática asignada.

**– Verificar que el hostname se haya aplicado correctamente**

hostname -f

**Resultado esperado:**

cellmanager.homelab.local

**– Verificar que la entrada en /etc/hosts fue agregada correctamente**

grep cellmanager /etc/hosts

**Resultado esperado:**

192.168.2.6 cellmanager.homelab.local cellmanager

**Paso 3: Montar la ISO y configurar repositorios locales en RHEL 8.5**

**<span class="mark">OPCION 1:</span>**

**– ISO montada como CD/DVD virtual en Proxmox**

Si, en la VM de RHEL, montaste la ISO en la unidad de CD/DVD virtual:

1.  En Proxmox, ve a **VM → Hardware → CD/DVD Drive → Use ISO image** y selecciona la ISO.

2.  En RHEL, la unidad de CD/DVD normalmente aparece como /dev/sr0.

Puedes montarla con:

sudo mkdir -p /mnt/iso

sudo mount /dev/sr0 /mnt/iso

Luego puedes ver los archivos:

ls -ltra /mnt/iso

Esto es **temporal**: cuando desmontes la ISO en Proxmox o reinicies, /mnt/iso estará vacío hasta que la vuelvas a montar.

**– Confirmar que la ISO está visible**

df -h \# Ver si /mnt/iso está montado

lsblk \# Ver discos y particiones

**<span class="mark">OPCION 2:</span>**

**– Crear el punto de montaje para la ISO**

sudo mkdir -p /mnt/iso

Este comando crea el directorio donde se montará la imagen ISO.

**– Montar la ISO desde /tmp**

sudo mount -o loop /tmp/rhel-8.5-x86_64-dvd.iso /mnt/iso

Asegúrate de que el nombre del archivo coincida exactamente. Este comando monta el contenido de la ISO en /mnt/iso.

**– Verificar el contenido montado**

ls /mnt/iso

Debes ver los directorios BaseOS/ y AppStream/.

**– Configurar repositorio local para BaseOS**

cat \<\< EOF \| sudo tee /etc/yum.repos.d/BaseOS.repo

\[BaseOS\]

name=BaseOS

baseurl=file:///mnt/iso/BaseOS

enabled=1

gpgcheck=0

EOF

**– Configurar repositorio local para AppStream**

cat \<\< EOF \| sudo tee /etc/yum.repos.d/AppStream.repo

\[AppStream\]

name=AppStream

baseurl=file:///mnt/iso/AppStream

enabled=1

gpgcheck=0

EOF

**– Deshabilitar plugins de DNF (opcional)**

Para evitar interferencias durante la instalación desde fuentes locales (como ISO montada), se puede deshabilitar el uso de plugins en dnf.

echo "plugins=0" \>\> /etc/dnf/dnf.conf

Este comando agrega la línea plugins=0 al archivo de configuración de DNF para deshabilitar todos los plugins.

**Verificación:**

cat /etc/dnf/dnf.conf

**Salida esperada:**

\[main\]

gpgcheck=1

installonly_limit=3

clean_requirements_on_remove=True

best=True

skip_if_unavailable=False

plugins=0

> 📝 **Nota:** Esto es útil si estás usando una fuente local (como una ISO montada) y deseas evitar que DNF intente usar repositorios externos o plugins automáticos que modifiquen el comportamiento.

**– Limpiar y reconstruir la caché de repositorios**

sudo dnf clean all

sudo dnf makecache

**Paso 4: Instalación de utilidades requeridas**

**– Utilidades requeridas del sistema operativo**

Instalar los siguientes paquetes esenciales para administración, compilación y diagnóstico del sistema:

sudo dnf install -y iputils telnet traceroute vim-enhanced lsof bash NetworkManager-tui gcc make kernel-devel kernel-headers openssh unzip zip tar lsscsi pciutils net-tools libnsl nscd chkconfig

**– Utilidades obligatorias para OpenText Data Protector (DP)**

Instalar los siguientes paquetes requeridos para ejecutar servicios de red como omni:

sudo dnf install -y xinetd bc && sudo systemctl enable --now xinetd && sudo systemctl status xinetd

**Explicación de utilidades:**

- xinetd: gestor de servicios de red bajo demanda.

- bc: calculadora en línea de comandos utilizada por scripts de instalación de DP.

**Paso 5: Creación del usuario hpdp**

El usuario hpdp es requerido por OpenText Data Protector para ejecutar servicios y procesos internos. A continuación, se crean el grupo y usuario necesarios con permisos apropiados.

groupadd hpdp && \\

useradd -d /home/hpdp -s /bin/bash -m -g hpdp -G wheel hpdp && \\

passwd -d hpdp && \\

usermod -L hpdp

Explicación de cada comando:

- groupadd hpdp: crea el grupo hpdp.

- useradd -d /home/hpdp -s /bin/bash -m -g hpdp -G wheel hpdp:

  - Crea el usuario hpdp con su directorio home.

  - Asigna el shell /bin/bash.

  - Lo agrega al grupo hpdp y también al grupo administrativo wheel.

- passwd -d hpdp: elimina la contraseña del usuario (sin acceso por login).

- usermod -L hpdp: bloquea el usuario para que no pueda iniciar sesión directamente.

> 📝 **Nota:** El usuario hpdp será usado únicamente por los servicios de Data Protector. No requiere acceso interactivo al sistema.

**Paso 6: Configuración de límites de archivos abiertos (Open File Limits)**

En el host Cell Manager, los procesos de OpenText Data Protector pueden requerir abrir numerosos archivos de manera simultánea. Por esta razón, es necesario aumentar el límite de archivos abiertos del sistema operativo a al menos 8192 por usuario en /etc/security/limits.conf

Agregar las siguientes líneas al final del archivo:

echo -e "root soft nofile 8192\nroot hard nofile 16384\nhpdp soft nofile 8192\nhpdp hard nofile 16384" \| sudo tee -a /etc/security/limits.conf

Asegúrate de que el usuario hpdp ya haya sido creado antes de aplicar estos valores.

Importante:

Después de realizar estos cambios, cierra sesión y vuelve a iniciarla para que surtan efecto. Esto es esencial para que el instalador de Data Protector detecte correctamente los nuevos límites.

**Verificación de límites de archivos abiertos**

Después de modificar /etc/security/limits.conf, puedes verificar que el nuevo valor esté activo usando:

ulimit -a \| grep open

Ejemplo de salida correcta:

open files (-n) 8192

Esto indica que el límite suave de archivos abiertos es 8192, tal como se configuró.\
Si el valor aún no refleja lo configurado, asegúrate de cerrar y volver a iniciar sesión, o reiniciar el sistema si es necesario.

**Paso 7: Apertura de puertos requeridos en el firewall**

OpenText Data Protector necesita que los siguientes puertos TCP estén abiertos en el firewall del Cell Manager para permitir la comunicación entre agentes, clientes remotos y la consola GUI:

- 5555/tcp: Puerto principal para el servicio omni.

- 5565/tcp: Utilizado por procesos internos de comunicación entre componentes.

- 7116/tcp: Necesario para la conexión desde el cliente GUI.

**– Comandos para abrir los puertos de forma permanente:**

sudo firewall-cmd --permanent --add-port={5555/tcp,5565/tcp,7111/tcp,7112/tcp,7113/tcp,7115/tcp,7116/tcp,9999/tcp} && sudo firewall-cmd --reload

**Verificación:**

firewall-cmd --list-ports

**Resumen de puertos incluidos:**

- Data Protector INET: 5555/5565

- Internal Database Service Port: 7112

- Internal Database Connection Pooler port: 7113

- Application server port: 7116

- Application server management port: 9999

- Identity Access Management Server port: 7115

- Message Broker port: 7111

- Asegúrate de que estos puertos estén abiertos tanto en el Cell Manager como en los clientes GUI si aplica.

- El parámetro --permanent asegura que los cambios persistan tras reiniciar el sistema.\
  --reload aplica los cambios de inmediato.

**Final del formulario**

**Paso 8: Instalación de OpenText Data Protector 24.4**

Descomprimir e instalar los paquetes RPM de Data Protector en el host Cell Manager.

**– Crear directorio temporal**

mkdir -p /tmp/DP244

Se crea un directorio de trabajo temporal donde se descomprimirá el contenido del paquete.

**– Descomprimir el paquete de instalación**

tar -xvzf /tmp/DP244/DP_244_GPLx86_64.tar.gz -C /tmp/DP244

Se extraen los archivos del instalador en el directorio creado.

**– Ingresar al directorio de instalación y verificar el instalador**

cd /tmp/DP244/LOCAL_INSTALL && ls -l

Asegúrate de que dentro del directorio se encuentre el archivo ejecutable omnisetup.sh, necesario para iniciar la instalación.

**– Ejecutar el instalador como Cell Manager**

./omnisetup.sh -CM -IS -inetport 5555 -accept_obsolescence -secure_data_comm 1 -auditlog 1

I accept the terms in the license agreement \[Y/N\] : Y

Enter Company Name\[\] :HOMELAB

Enter Proxy Address\[\] :

Are you sure you wish to skip proxy settings\[Y/N\] :Y

- El parámetro -CM indica que se instalará el rol de Cell Manager.

- El parámetro -IS indica que se instalará el rol de Installation Server.

- El parámetro -inetport 5555 especifica el puerto que usará el servicio omniinet (por defecto es 5565, pero aquí se define explícitamente el 5555).

**Paso 9: Modificación del archivo global**

Permitir que cualquier cliente GUI se conecte al **Cell Manager** sin restricciones por nombre de host, activando la opción EnableAnyOptionUserCtx.

**– Verificar si la opción ya existe**

grep EnableAnyOptionUserCtx /etc/opt/omni/server/options/global

**– Editar el archivo de configuración**

Abre el archivo con el editor:

vi /etc/opt/omni/server/options/global

**– Agregar o modificar la línea de configuración**

Dentro del archivo, asegúrate de que exista la siguiente línea y **no esté comentada**:

EnableAnyOptionUserCtx=1

**– Guardar los cambios**

Guarda el archivo y cierra el editor (vi → presiona ESC, escribe :wq, y pulsa Enter).

**Paso 10: Crear usuario administrador Windows en Data Protector**

Crear un usuario de tipo Windows (-type W) que pueda conectarse desde cualquier cliente, grupo o nombre de usuario. Este usuario tendrá privilegios administrativos para la gestión desde interfaces gráficas remotas (GUI).

**Comando utilizado:**

/opt/omni/bin/omniusers -add -type W -usergroup admin -name "\*" -group "\*" -client "\*" -pass Colombia.2026 -desc "Administrador Windows"

**Resultado esperado:**

User '\*' successfully added to 'admin' group.

**Advertencia de seguridad:**\
El uso de comodines (\*) para permitir acceso desde cualquier usuario, grupo o cliente desactiva mecanismos de seguridad, lo que **puede representar riesgos significativos** si no se acompaña de medidas adicionales de protección.

**Recomendación:**\
Utiliza esta configuración solo en entornos controlados o de laboratorio. Para producción, define usuarios específicos por nombre y cliente.

**Comando para listar usuarios actuales**

/opt/omni/bin/omniusers -list

**Resultado esperado:**

User Group: admin

Name: \*

Group: \*

Client: \*

Web Username: \*\|\*\|\*

Descr: Administrador Windows

**Paso 11: Validaciones finales de configuración**

Verificar que los servicios esenciales están activos, que el firewall permite la comunicación necesaria, y que el puerto principal de Data Protector (5555) está en escucha.

**– Verificar el estado del firewall**

firewall-cmd --state

Salida esperada:

running

**– Comprobar que los puertos requeridos están abiertos**

firewall-cmd --list-ports

Verifica que estén listados los siguientes puertos:

5555/tcp 5565/tcp 7111/tcp 7112/tcp 7113/tcp 7115/tcp 7116/tcp 9999/tcp

**– Validar que Data Protector esté escuchando en el puerto 5555**

netstat -tuln \| grep :5555

Salida esperada (ejemplo):

tcp 0 0 0.0.0.0:5555 0.0.0.0:\* LISTEN

**Recomendación:**\
Si alguno de estos comandos no devuelve los resultados esperados, revisa los servicios de Data Protector (/opt/omni/sbin/omnisv status) o la configuración del firewall.

**Paso 12: Reiniciar servicios y validar estado del Cell Manager**

Hay que asegurar que todos los servicios esenciales de OpenText Data Protector estén activos y funcionando correctamente.

**– Verificar el estado de los servicios actuales:**

/opt/omni/sbin/omnisv status

**Ejemplo de salida:**

ProcName Status \[PID\]

===============================

crs : Active \[22926\]

mmd : Active \[22925\]

kms : Active \[22864\]

hpdp-idb : Active \[22959\]

hpdp-idb-cp : Active \[22982\]

hpdp-as : Active \[23428\]

hpdp-iam : Active \[22995\]

hpdp-as-mq : Active

omnitrig : Active

Sending of traps disabled.

===============================

Status: All Cell Server processes/services up and running.

**– Reiniciar los servicios**

Si necesitas reiniciar los servicios, ejecuta:

/opt/omni/sbin/omnisv stop

/opt/omni/sbin/omnisv start

**Resultado esperado tras el reinicio:**

- Todos los procesos deben aparecer como Active.

- El mensaje final debe indicar: All Cell Server processes/services up and running.

**Paso 13: Configuración de Reglas de Firewall en Windows (GUI)**

Permitir conexiones entrantes al puerto TCP 7116, necesario para la comunicación entre el GUI y el servidor Cell Manager de Data Protector.

**– Crear una nueva regla de firewall en Windows**

New-NetFirewallRule -DisplayName "Allow TCP Port 7116" -Direction Inbound -Protocol TCP -LocalPort 7116 -Action Allow

**Explicación:**

- New-NetFirewallRule: Crea una nueva regla en el firewall de Windows.

- -DisplayName "Allow TCP Port 7116": Nombre descriptivo de la regla.

- -Direction Inbound: La regla aplica para el tráfico que entra al equipo.

- -Protocol TCP: Aplica a tráfico TCP.

- -LocalPort 7116: Puerto local que se permite.

- -Action Allow: Permite el tráfico (en vez de bloquearlo).

> > 📝 **Nota:** Este comando debe ejecutarse en PowerShell como Administrador.

**– Verificar que la regla fue creada correctamente**

Get-NetFirewallRule -DisplayName "Allow TCP Port 7116"

**Explicación:**

- Get-NetFirewallRule: Muestra las reglas existentes del firewall.

- -DisplayName "Allow TCP Port 7116": Filtra para mostrar solo la regla con ese nombre.

Si la regla se creó correctamente, este comando debe mostrarla en la salida.

**Paso 14: Configuración de comunicación segura entre Cell Manager y GUI**

Data Protector usa "secure communication" entre sus componentes. Esta comunicación debe ser configurada y autorizada entre los pares involucrados (servidor y GUI).

**En el servidor Cell Manager (Linux)**

**Comando:**

sudo /opt/omni/bin/omnicc -secure_comm -configure_peer gui.homelab.local

**Explicación:**

- sudo: Se ejecuta con privilegios de superusuario.

- /opt/omni/bin/omnicc: Ejecutable del componente Cell Manager.

- -secure_comm: Indica que se está trabajando con comunicación segura.

- -configure_peer: Indica que se va a configurar una relación segura con otro host.

- gui.homelab.local: Nombre del host GUI de Windows con el que se establecerá la confianza.

Esto se debe ejecutar desde el servidor Cell Manager Linux, y solo después de haber añadido correctamente el GUI en la red.

**En el servidor GUI (Windows)**

**Desde CMD (símbolo del sistema) como Administrador:**

omnicc -secure_comm -configure_peer cellmanager.homelab.local

**Explicación:**

- omnicc: Comando de HP Data Protector disponible tras la instalación del GUI.

- -secure_comm -configure_peer: Configura comunicación segura con otro host.

- cellmanager.homelab.local: Nombre del host del servidor Cell Manager (Linux).

Este paso **complementa** el anterior. Ambos lados deben ejecutar este comando para que la confianza sea mutua y completa.

**Resultado Esperado:**

Después de ejecutar estos pasos:

- El Cell Manager y el GUI podrán comunicarse de forma segura mediante certificados mutuos.

- La conexión GUI → Cell Manager debería funcionar correctamente.

**Paso 15: Tunning DPIDB**

**Warning de IDB Backup (AES)**

**Mensaje:**During an IDB backup, important configuration and security information is processed and saved. It is highly recommended to secure such backups by enabling AES encryption...

Alternately, use the omnirc variable OB2_DISABLE_IDB_BKP_ENCRYPTION_WARNING

**Solución:** deshabilitar el warning vía .omnirc

**– Verificar si existe el archivo .omnirc:**

ls -l /opt/omni/.omnirc

**– Si no existe, crear el archivo y añadir la variable:**

echo "OB2_DISABLE_IDB_BKP_ENCRYPTION_WARNING=1" \>\> /opt/omni/.omnirc

**– Verificar que la variable quedó correcta:**

grep OB2_DISABLE_IDB_BKP_ENCRYPTION_WARNING /opt/omni/.omnirc

**Salida esperada:**

\# OB2_DISABLE_IDB_BKP_ENCRYPTION_WARNING=1

**Warning de Recovery Index (RecoveryIndexDir)**

**Mensaje:** It is highly recommended to store the recovery index file (obrindex.dat) on a separate volumen using the global option RecoveryIndexDir...

Alternatively, use the global variable DisableOBRIndexWarning

**Solución:** crear directorio o usar la variable.

**– Crear directorio para el Recovery Index:**

mkdir -p /DP_OBRINDEX_COPY

**Editar la opción global de DP para indicar el nuevo path:**

vi /etc/opt/omni/server/options/global

**– Dentro del archivo, añadir o modificar:**

RecoveryIndexDir=/DP_OBRINDEX_COPY

**– Guardar y salir**

(:wq si usas vi).

**– Verificar:**

grep RecoveryIndexDir /etc/opt/omni/server/options/global

**Salida esperada:**

\# RecoveryIndexDir=/DP_OBRINDEX_COPY

**–** Si quieres simplemente ignorar el warning del Recovery Index sin crear el directorio, puedes añadir en global:

DisableOBRIndexWarning=1
