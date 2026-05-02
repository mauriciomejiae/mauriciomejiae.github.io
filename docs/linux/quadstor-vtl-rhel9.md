---
sidebar_position: 2
title: Instalación QUADStor VTL en RHEL 9.0
description: Guía completa de instalación y configuración de QUADStor Virtual Tape Library en RHEL 9.0, incluyendo conexión iSCSI desde Windows y Linux.
tags: [linux, rhel, quadstor, vtl, iscsi, backup]
---

# Instalación QUADStor VTL en RHEL 9.0

Instalación y configuración de QUADStor Virtual Tape Library en RHEL 9.0.

---

## 🔹 Paso 1: Configurar IP estática y desactivar IPv6

Identificar la interfaz de red activa:

```bash
ip -o link show | awk -F': ' '{print $2}' | grep -v lo
```

Ejemplo de salida: `ens18`

Configurar IP estática, gateway, DNS y desactivar IPv6:

```bash
sudo nmcli con mod ens18 ipv4.addresses 192.168.2.7/24 \
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

Establecer el nombre de host:

```bash
sudo hostnamectl set-hostname quadstorvtl.homelab.local
```

Agregar entrada en `/etc/hosts`:

```bash
echo "192.168.2.7 quadstorvtl.homelab.local quadstorvtl" | sudo tee -a /etc/hosts
```

Verificar:

```bash
hostname -f
grep quadstorvtl /etc/hosts
```

Resultado esperado: `quadstorvtl.homelab.local`

---

## 🔹 Paso 3: Montar la ISO y configurar repositorios locales

**OPCIÓN 1** – ISO montada como CD/DVD virtual en Proxmox:

1. En Proxmox: VM → Hardware → CD/DVD Drive → Use ISO image
2. En RHEL, la unidad aparece como `/dev/sr0`

```bash
sudo mkdir -p /mnt/iso
sudo mount /dev/sr0 /mnt/iso
ls -ltra /mnt/iso
```

:::caution
El montaje es temporal; al reiniciar, `/mnt/iso` quedará vacío.
:::

Confirmar que la ISO está visible:

```bash
df -h
lsblk
```

---

## 🔹 Paso 4: Registrar el sistema en Red Hat Subscription Manager

```bash
subscription-manager register --username <usuario> --password <contraseña> --force
subscription-manager attach
```

---

## 🔹 Paso 5: Instalar dependencias requeridas

En RHEL / CentOS:

```bash
yum install httpd make gcc perl kernel-devel e2fsprogs-libs sg3_utils iotop sysstat tar xz postgresql-libs postgresql-server chkconfig -y
```

En RHEL / AlmaLinux / Rocky 9 (paquetes adicionales):

```bash
yum install elfutils-libelf-devel policycoreutils policycoreutils-python-utils libpq-devel -y
```

---

## 🔹 Paso 6: Verificar versión del kernel

```bash
rpm -qa | grep kernel-devel
uname -r
```

Si la versión del paquete `kernel-devel` es más reciente que el kernel instalado:

```bash
yum upgrade kernel
reboot
yum upgrade kernel-devel
```

---

## 🔹 Paso 7: Verificación de Secure Boot

:::warning
Los sistemas con Secure Boot **no son compatibles**; los módulos del servicio VTL no se iniciarán si está activo.
:::

```bash
grep "Secure boot enabled" /var/log/messages
```

Si aparece como habilitado, desactivar Secure Boot en la BIOS antes de continuar.

---

## 🔹 Paso 8: Habilitar inicio automático de Apache

```bash
systemctl enable httpd
```

---

## 🔹 Paso 9: Configurar firewall para acceso GUI (puerto 80)

```bash
sudo systemctl enable --now firewalld
sudo firewall-cmd --permanent --add-port=80/tcp
sudo firewall-cmd --reload
sudo firewall-cmd --list-all
```

---

## 🔹 Paso 10: Instalación del software QUADStor VTL

```bash
rpm -ivh quadstor-vtl-std-3.0.79.27-rhel9.x86_64.rpm
```

Los servicios `quadstorvtl` se inician automáticamente al arrancar el sistema.

Gestión manual del servicio:

```bash
# Eliminar inicio automático
sudo systemctl disable quadstorvtl

# Habilitar inicio automático nuevamente
sudo systemctl enable quadstorvtl

# Iniciar servicio manualmente
sudo systemctl start quadstorvtl

# Detener servicio
sudo systemctl stop quadstorvtl

# Ver estado del servicio
sudo systemctl status quadstorvtl

# Ver si está configurado para arranque automático
systemctl is-enabled quadstorvtl

# Ver si está corriendo
systemctl is-active quadstorvtl
```

---

## 🔹 Paso 11: Consideraciones sobre SELinux

Si SELinux está habilitado:

```bash
/usr/sbin/setsebool -P httpd_enable_cgi 1
/usr/sbin/semanage permissive -a httpd_t
reboot
```

Para desactivar SELinux permanentemente:

```bash
sudo sed -i 's/^SELINUX=.*/SELINUX=disabled/' /etc/selinux/config
sudo setenforce 0
sudo reboot
```

Verificar tras el reinicio:

```bash
sestatus
```

Debe decir: `SELinux status: disabled`

---

## Referencia oficial

Para más detalles: [QUADStor Installation Guide](https://quadstor.com/vtlsupport/145-installation-on-rhel-centos-sles-debian.html)

---

## Conexión iSCSI – QuadStor VTL

### Servidor QuadStor

Verificar que iSCSI esté activo y escuchando en el puerto 3260:

```bash
sudo ss -tulnp | grep 3260
```

Salida esperada:

```
tcp  LISTEN  0  32  0.0.0.0:3260  0.0.0.0:*  users:(("ietd",pid=2044,fd=9))
tcp  LISTEN  0  32  [::]:3260     [::]:*     users:(("ietd",pid=2044,fd=10))
```

Abrir el puerto iSCSI en el firewall:

```bash
sudo firewall-cmd --permanent --add-port=3260/tcp
sudo firewall-cmd --reload
sudo firewall-cmd --list-ports
```

### Cliente Windows

1. Abrir iSCSI Initiator: `Win + R` → `iscsicpl` → Enter
2. Pestaña Discovery → Discover Portal → IP: `192.168.2.7`, Puerto: `3260` → OK
3. Pestaña Targets → seleccionar IQN de la librería VTL → Connect

### Cliente Linux

Instalar el cliente iSCSI:

```bash
# Ubuntu/Debian
sudo apt install open-iscsi -y

# RHEL/OL7/8/9, Rocky, Alma
sudo yum install iscsi-initiator-utils -y
```

Habilitar e iniciar el servicio:

```bash
# Ubuntu/Debian
sudo systemctl enable --now open-iscsi

# RHEL/Oracle Linux
sudo systemctl enable --now iscsid
sudo systemctl enable --now iscsi
```

Descubrir el target iSCSI:

```bash
sudo iscsiadm -m discovery -t sendtargets -p 192.168.2.7:3260
```

Iniciar sesión en el target:

```bash
sudo iscsiadm -m node -T iqn.2006-06.com.quadstor.vtl.IBM.TS3500.autoloader --login
sudo iscsiadm -m node -T iqn.2006-06.com.quadstor.vtl.IBM.TS3500.drive1 --login
sudo iscsiadm -m node -T iqn.2006-06.com.quadstor.vtl.IBM.TS3500.drive2 --login
```

Para reconexión automática al iniciar:

```bash
sudo iscsiadm -m node -T iqn.2006-06.com.quadstor.vtl.IBM.TS3500.autoloader --op update -n node.startup -v automatic
sudo iscsiadm -m node -T iqn.2006-06.com.quadstor.vtl.IBM.TS3500.drive1 --op update -n node.startup -v automatic
sudo iscsiadm -m node -T iqn.2006-06.com.quadstor.vtl.IBM.TS3500.drive2 --op update -n node.startup -v automatic
```
