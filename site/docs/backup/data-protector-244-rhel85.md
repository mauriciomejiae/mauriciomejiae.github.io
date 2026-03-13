---
sidebar_position: 1
title: Instalación Cell Manager Data Protector 24.4
description: Guía completa de instalación y configuración del Cell Manager de OpenText Data Protector 24.4 en RHEL 8.5, incluyendo firewall, usuario hpdp, límites de archivos y validaciones finales.
tags: [backup, data-protector, rhel, cell-manager, opentext]
---

# Instalación Cell Manager Data Protector 24.4 en RHEL 8.5

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

---

## 🔹 Paso 2: Configurar hostname y /etc/hosts

```bash
sudo hostnamectl set-hostname cellmanager.homelab.local
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

### Opción 2: ISO desde /tmp

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

:::note
El usuario `hpdp` será usado únicamente por los servicios de Data Protector. No requiere acceso interactivo al sistema.
:::

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

Verificación de límites (después de relogin):

```bash
ulimit -a | grep open
```

Salida esperada:

```
open files    (-n) 8192
```

---

## 🔹 Paso 7: Apertura de puertos requeridos en el firewall

| Puerto   | Descripción                        |
| :------- | :--------------------------------- |
| 5555/tcp | Puerto principal para omni         |
| 5565/tcp | Comunicación interna entre componentes |
| 7116/tcp | Conexión desde el cliente GUI      |

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

```bash
mkdir -p /tmp/DP244
tar -xvzf /tmp/DP_244_GPLx86_64.tar.gz -C /tmp/DP244
cd /tmp/DP244/LOCAL_INSTALL
ls -l
```

Ejecutar el instalador como Cell Manager:

```bash
./omnisetup.sh -CM -inetport 5555
```

Responder a las preguntas del instalador:

```
I understand the changes to the supported platform [Y/E] : Y
Do you want to proceed without enabling '-secure_data_comm' and '-auditlog'? [Y/N]: Y
I accept the terms in the license agreement [Y/N] : Y
```

---

## 🔹 Paso 9: Modificación del archivo global

Permitir que cualquier cliente GUI se conecte al Cell Manager sin restricciones por hostname.

```bash
vi /etc/opt/omni/server/options/global
```

Asegurarse de que exista la siguiente línea:

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

:::caution
El uso de comodines (`*`) desactiva mecanismos de seguridad. Utilizar esta configuración solo en entornos controlados o de laboratorio.
:::

---

## 🔹 Paso 11: Validaciones finales de configuración

Verificar el estado del firewall:

```bash
firewall-cmd --state
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

```powershell
New-NetFirewallRule -DisplayName "Allow TCP Port 7116" -Direction Inbound -Protocol TCP -LocalPort 7116 -Action Allow
```

Verificar:

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

:::note
Ambos lados deben ejecutar este comando para que la confianza sea mutua y completa.
:::

---

## Tunning DPIDB

### Warning de IDB Backup (AES)

```bash
ls -l /opt/omni/.omnirc
echo "OB2_DISABLE_IDB_BKP_ENCRYPTION_WARNING=1" >> /opt/omni/.omnirc
grep OB2_DISABLE_IDB_BKP_ENCRYPTION_WARNING /opt/omni/.omnirc
```

### Warning de Recovery Index (RecoveryIndexDir)

```bash
mkdir -p /DP_OBRINDEX_COPY
vi /etc/opt/omni/server/options/global
```

Añadir o modificar:

```
RecoveryIndexDir=/DP_OBRINDEX_COPY
```

Si solo deseas ignorar el warning:

```
DisableOBRIndexWarning=1
```
