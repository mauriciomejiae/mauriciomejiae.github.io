# Manual – Ampliar disco en RHEL 8.5 (en Proxmox con LVM)

![Status](https://img.shields.io/badge/Status-Migrado-success?style=flat-square)
![Type](https://img.shields.io/badge/Type-Manual_Técnico-blue?style=flat-square)
![Last Updated](https://img.shields.io/badge/Date-2026-lightgrey?style=flat-square)

---

Ampliar disco en RHEL 8.5 de 30 GB a 50 GB en Proxmox con LVM.

---

## 🔹 Paso 1: Ampliar disco desde Proxmox

En la interfaz web de Proxmox:

VM → Hardware → Disco (sda) → Resize Disk → +20G → OK

---

## 🔹 Paso 2: Verificar disco dentro del sistema operativo

```bash
lsblk
df -h
```

Se ve el disco `sda` de 50 GB, pero la partición `sda2` aún de 28 GB.

---

## 🔹 Paso 3: Instalar herramienta growpart

```bash
sudo dnf install -y cloud-utils-growpart
```

---

## 🔹 Paso 4: Expandir la partición sda2

```bash
sudo growpart /dev/sda 2
```

Resultado: `/dev/sda2` ahora ocupa todo el disco (~49 GB).

---

## 🔹 Paso 5: Redimensionar el volumen físico LVM (PV)

```bash
sudo pvresize /dev/sda2
sudo pvs
sudo vgs
```

Espacio libre en el VG (`vg01`) ~21 GB.

---

## 🔹 Paso 6: Ampliar los volúmenes lógicos (LV)

Aumentar `/` (root) en +10 GB:

```bash
sudo lvextend -r -L +10G /dev/mapper/vg01-root
```

Aumentar `/var` en +5 GB:

```bash
sudo lvextend -r -L +5G /dev/mapper/vg01-var
```

El parámetro `-r` expande automáticamente el sistema de archivos XFS/ext4.

---

## 🔹 Paso 7: Verificar resultado final

```bash
lsblk
df -h
sudo vgs
```

Resultado esperado:

```
/dev/mapper/vg01-root   25G
/dev/mapper/vg01-var    11G
/dev/mapper/vg01-home    3G
VG libre (VFree) ≈ 11 GB (aún disponible para usar)
```

---

## Estado final

| Punto de montaje | Antes | Después           |
| :--------------- | :---- | :---------------- |
| `/`              | 15G   | 25G (ampliado)    |
| `/var`           | 6G    | 11G (ampliado)    |
| `/home`          | 3G    | 3G (sin cambios)  |
| VG libre         | —     | ~6 GB disponibles |

Verificación:

```bash
vgs
```

```
VG    #PV #LV #SN Attr   VSize   VFree
vg01    1   4   0 wz--n- <49.00g <6.00g
```
