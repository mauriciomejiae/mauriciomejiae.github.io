# Manual – Instalación Cell Manager Data Protector 24.4 en RHEL 8.5

![Status](https://img.shields.io/badge/Status-Migrado-success?style=flat-square)
![Type](https://img.shields.io/badge/Type-Manual_Técnico-blue?style=flat-square)
![Last Updated](https://img.shields.io/badge/Date-2026-lightgrey?style=flat-square)

---

Instalación y configuración del Cell Manager de OpenText Data Protector 24.4 en RHEL 8.5.

---

## 🔹 Paso 1: Configurar IP estática y desactivar IPv6

Identificar la interfaz de red activa:

```bash
ip -o link show | awk -F': ' '{print $2}' | grep -v lo
```

Ejemplo de salida: `ens18`

Configurar IP estática, gateway, DNS y desactivar IPv6:

```bash
sudo nmcli con mod ens18 ipv4.addresses 192.168.2.6/24 \
  ipv4.gateway 192.168.2.1 \
  ipv4.dns "8.8.8.8 8.8.4.4" \
  ipv4.method manual \
  ipv6.method ignore
```

Activar la conexión:

```bash
sudo nmcli con up ens18
```

Verificar configuración:

```bash
ip a show ens18
nmcli dev show ens18 | grep IP
```

Asegurar que la IP `192.168.2.6` esté activa y que no haya direcciones IPv6.

---

## 🔹 Paso 2: Configurar hostname y /etc/hosts

Establecer el nombre de host permanente:

```bash
sudo hostnamectl set-hostname cellmanager.homelab.local
```

Agregar la IP, FQDN y hostname corto al archivo `/etc/hosts`:

```bash
echo "192.168.2.6 cellmanager.homelab.local cellmanager" | sudo tee -a /etc/hosts
```

Verificar:

```bash
hostname -f
grep cellmanager /etc/hosts
```

Resultado esperado: `cellmanager.homelab.local`

---

## 🔹 Paso 3: Montar la ISO y configurar repositorios locales en RHEL 8.5

### Opción 1: ISO montada como CD/DVD virtual en Proxmox

1. En Proxmox: VM → Hardware → CD/DVD Drive → Use ISO image
2. En RHEL, la unidad aparece como `/dev/sr0`

```bash
sudo mkdir -p /mnt/iso
sudo mount /dev/sr0 /mnt/iso
ls -ltra /mnt/iso
```

Confirmar que la ISO está visible:

```bash
df -h
lsblk
```

### Opción 2: ISO desde /tmp

Crear el punto de montaje y montar:

```bash
sudo mkdir -p /mnt/iso
sudo mount -o loop /tmp/rhel-8.5-x86_64-dvd.iso /mnt/iso
ls /mnt/iso
```

Deben verse los directorios `BaseOS/` y `AppStream/`.

Configurar repositorio local para BaseOS:

```bash
cat << EOF | sudo tee /etc/yum.repos.d/BaseOS.repo
[BaseOS]
name=BaseOS
baseurl=file:///mnt/iso/BaseOS
enabled=1
gpgcheck=0
EOF
```

Configurar repositorio local para AppStream:

```bash
cat << EOF | sudo tee /etc/yum.repos.d/AppStream.repo
[AppStream]
name=AppStream
baseurl=file:///mnt/iso/AppStream
enabled=1
gpgcheck=0
EOF
```

Deshabilitar plugins de DNF (opcional):

```bash
echo "plugins=0" >> /etc/dnf/dnf.conf
```

> Esto es útil si estás usando una fuente local (como una ISO montada) y deseas evitar que DNF intente usar repositorios externos.

Limpiar y reconstruir la caché de repositorios:

```bash
sudo dnf clean all
sudo dnf makecache
```

---

## 🔹 Paso 4: Instalación de utilidades requeridas

Utilidades del sistema operativo:

```bash
dnf install -y iputils telnet traceroute vi lsof bash NetworkManager-tui \
  gcc make kernel-devel kernel-headers openssh unzip zip tar lsscsi pciutils net-tools
```

Utilidades obligatorias para Data Protector:

```bash
dnf install -y xinetd bc
systemctl enable xinetd
systemctl start xinetd
```

Verificar que el servicio esté activo:

```bash
systemctl status xinetd
```

- `xinetd`: gestor de servicios de red bajo demanda
- `bc`: calculadora en línea de comandos utilizada por scripts de instalación de DP

---

## 🔹 Paso 5: Creación del usuario hpdp

El usuario `hpdp` es requerido por Data Protector para ejecutar servicios y procesos internos:

```bash
groupadd hpdp && \
useradd -d /home/hpdp -s /bin/bash -m -g hpdp -G wheel hpdp && \
passwd -d hpdp && \
usermod -L hpdp
```

- `groupadd hpdp`: crea el grupo hpdp
- `useradd`: crea el usuario con home, shell bash y lo agrega al grupo wheel
- `passwd -d hpdp`: elimina la contraseña del usuario
- `usermod -L hpdp`: bloquea el usuario para que no pueda iniciar sesión directamente

> El usuario `hpdp` será usado únicamente por los servicios de Data Protector. No requiere acceso interactivo al sistema.

---

## 🔹 Paso 6: Configuración de límites de archivos abiertos

Editar el archivo de configuración de límites:

```bash
vi /etc/security/limits.conf
```

Agregar las siguientes líneas al final del archivo:

```
root    soft    nofile    8192
root    hard    nofile    16384
hpdp    soft    nofile    8192
hpdp    hard    nofile    16384
```

Después de realizar estos cambios, cerrar sesión y volver a iniciarla para que surtan efecto.

Verificación de límites:

```bash
ulimit -a | grep open
```

Salida esperada:

```
open files    (-n) 8192
```

---

## 🔹 Paso 7: Apertura de puertos requeridos en el firewall

Puertos necesarios:

- `5555/tcp`: Puerto principal para el servicio omni
- `5565/tcp`: Comunicación interna entre componentes
- `7116/tcp`: Conexión desde el cliente GUI

```bash
firewall-cmd --permanent --add-port=5555/tcp
firewall-cmd --permanent --add-port=5565/tcp
firewall-cmd --permanent --add-port=7116/tcp
firewall-cmd --reload
```

Verificación:

```bash
firewall-cmd --list-ports
```

Salida esperada:

```
5555/tcp 5565/tcp 7116/tcp
```

---

## 🔹 Paso 8: Instalación de OpenText Data Protector 24.4

Crear directorio temporal:

```bash
mkdir -p /tmp/DP244
```

Descomprimir el paquete de instalación:

```bash
tar -xvzf /tmp/DP_244_GPLx86_64.tar.gz -C /tmp/DP244
```

Ingresar al directorio de instalación y verificar el instalador:

```bash
cd /tmp/DP244/LOCAL_INSTALL
ls -l
```

Ejecutar el instalador como Cell Manager:

```bash
./omnisetup.sh -CM -inetport 5555
```

- `-CM`: instala el rol de Cell Manager
- `-inetport 5555`: puerto que usará el servicio omniinet

Responder a las preguntas del instalador:

```
I understand the changes to the supported platform [Y/E] : Y
Do you want to proceed without enabling '-secure_data_comm' and '-auditlog'? [Y/N]: Y
I accept the terms in the license agreement [Y/N] : Y
```

---

## 🔹 Paso 9: Modificación del archivo global

Permitir que cualquier cliente GUI se conecte al Cell Manager sin restricciones por hostname.

Verificar si la opción ya existe:

```bash
grep EnableAnyOptionUserCtx /etc/opt/omni/server/options/global
```

Editar el archivo de configuración:

```bash
vi /etc/opt/omni/server/options/global
```

Asegurarse de que exista la siguiente línea (sin comentar):

```
EnableAnyOptionUserCtx=1
```

---

## 🔹 Paso 10: Crear usuario administrador Windows en Data Protector

```bash
/opt/omni/bin/omniusers -add -type W -usergroup admin \
  -name "*" -group "*" -client "*" \
  -pass Colombia.2025 -desc "Usuario Administrador Windows"
```

Resultado esperado:

```
User '*' successfully added to 'admin' group.
```

> El uso de comodines (`*`) desactiva mecanismos de seguridad. Utilizar esta configuración solo en entornos controlados o de laboratorio.

Listar usuarios actuales:

```bash
/opt/omni/sbin/omniusers -list
```

---

## 🔹 Paso 11: Validaciones finales de configuración

Verificar el estado del firewall:

```bash
firewall-cmd --state
```

Comprobar que los puertos requeridos están abiertos:

```bash
firewall-cmd --list-ports
```

Validar que Data Protector esté escuchando en el puerto 5555:

```bash
netstat -tuln | grep :5555
```

Salida esperada:

```
tcp  0  0  0.0.0.0:5555  0.0.0.0:*  LISTEN
```

> Si alguno de estos comandos no devuelve los resultados esperados, revisar los servicios: `/opt/omni/sbin/omnisv status`.

---

## 🔹 Paso 12: Reiniciar servicios y validar estado del Cell Manager

Verificar el estado de los servicios:

```bash
/opt/omni/sbin/omnisv status
```

Salida esperada:

```
ProcName        Status   [PID]
===============================
crs           : Active   [22926]
mmd           : Active   [22925]
kms           : Active   [22864]
hpdp-idb      : Active   [22959]
hpdp-idb-cp   : Active   [22982]
hpdp-as       : Active   [23428]
hpdp-iam      : Active   [22995]
hpdp-as-mq    : Active
omnitrig      : Active
===============================
Status: All Cell Server processes/services up and running.
```

Reiniciar los servicios (si es necesario):

```bash
/opt/omni/sbin/omnisv stop
/opt/omni/sbin/omnisv start
```

---

## 🔹 Paso 13: Configuración de reglas de Firewall en Windows

Crear una nueva regla de firewall en Windows (PowerShell como Administrador):

```powershell
New-NetFirewallRule -DisplayName "Allow TCP Port 7116" -Direction Inbound -Protocol TCP -LocalPort 7116 -Action Allow
```

Verificar que la regla fue creada correctamente:

```powershell
Get-NetFirewallRule -DisplayName "Allow TCP Port 7116"
```

---

## 🔹 Paso 14: Configuración de comunicación segura entre Cell Manager y GUI

En el servidor Cell Manager (Linux):

```bash
sudo /opt/omni/bin/omnicc -secure_comm -configure_peer gui.homelab.local
```

En el servidor GUI (Windows) — CMD como Administrador:

```cmd
omnicc -secure_comm -configure_peer cellmanager.homelab.local
```

Ambos lados deben ejecutar este comando para que la confianza sea mutua y completa. Después de esto, la conexión GUI → Cell Manager debería funcionar correctamente mediante certificados mutuos.

---

## Tunning DPIDB

### Warning de IDB Backup (AES)

Verificar si existe el archivo `.omnirc`:

```bash
ls -l /opt/omni/.omnirc
```

Si no existe, crear el archivo y añadir la variable:

```bash
echo "OB2_DISABLE_IDB_BKP_ENCRYPTION_WARNING=1" >> /opt/omni/.omnirc
```

Verificar:

```bash
grep OB2_DISABLE_IDB_BKP_ENCRYPTION_WARNING /opt/omni/.omnirc
```

### Warning de Recovery Index (RecoveryIndexDir)

Crear directorio para el Recovery Index:

```bash
mkdir -p /DP_OBRINDEX_COPY
```

Editar la opción global de DP:

```bash
vi /etc/opt/omni/server/options/global
```

Añadir o modificar:

```
RecoveryIndexDir=/DP_OBRINDEX_COPY
```

Verificar:

```bash
grep RecoveryIndexDir /etc/opt/omni/server/options/global
```

Si solo deseas ignorar el warning sin crear el directorio:

```
DisableOBRIndexWarning=1
```
