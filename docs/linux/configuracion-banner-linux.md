---
sidebar_position: 1
title: Manual – Configuración Banner Profesional de Bienvenida – Linux
description: Configuración de un banner profesional de login en RHEL 8.5 con información del sistema y advertencia de uso autorizado mediante /etc/profile.d/banner.sh.
tags: [linux, rhel, seguridad, banner, ssh]
---

# Manual – Configuración Banner Profesional de Bienvenida – Linux

Configuración de un banner profesional de login para RHEL 8.5 con información del sistema y advertencia de uso autorizado.

---

## Paso 1: Crear el script del banner

Crear el archivo `/etc/profile.d/banner.sh` con el siguiente contenido:

```bash
#!/bin/bash

# Banner profesional con texto completo en negrilla y advertencia en naranja

# Datos dinámicos
HOSTNAME_FULL=$(hostname)
IP=$(hostname -I | awk '{print $1}')
USER=$(whoami)
FECHA=$(date "+%Y-%m-%d %H:%M:%S")
UPTIME=$(uptime -p | sed 's/^up //')
OS=$(awk -F= '/^PRETTY_NAME/{gsub(/"/,"");print $2}' /etc/os-release)

# Colores ANSI
YELLOW="\e[33m"
GREEN_BOLD="\e[1;32m"
ORANGE_BOLD="\e[1;38;5;208m"
RESET="\e[0m"
BOLD="\e[1m"

# Longitud del banner
WIDTH=75

# Funciones auxiliares
print_line() {
  local char="$1"
  printf "%${WIDTH}s\n" | tr " " "$char"
}

print_field() {
  local label="$1"
  local value="$2"
  local line=" ${label}: ${value}"
  printf "%-${WIDTH}s\n" "$line"
}

# Mostrar banner
clear
echo -e "${BOLD}${YELLOW}$(print_line '=')${RESET}"
echo -e "${GREEN_BOLD}$(print_field 'Servidor' "$HOSTNAME_FULL")${RESET}"
echo -e "${GREEN_BOLD}$(print_field 'Sistema Operativo' "$OS")${RESET}"
echo -e "${GREEN_BOLD}$(print_field 'Dirección IP' "$IP")${RESET}"
echo -e "${GREEN_BOLD}$(print_field 'Usuario' "$USER")${RESET}"
echo -e "${GREEN_BOLD}$(print_field 'Fecha/Hora' "$FECHA")${RESET}"
echo -e "${GREEN_BOLD}$(print_field 'Uptime del sistema' "$UPTIME")${RESET}"
echo -e "${BOLD}${YELLOW}$(print_line '=')${RESET}"

# Advertencia profesional en naranja y negrilla
echo -e "${ORANGE_BOLD} ADVERTENCIA: Este sistema es de uso exclusivo para personal autorizado."
echo -e " Todo acceso, actividad o intento de ingreso será registrado y monitoreado."
echo -e " El uso no autorizado de este sistema puede resultar en sanciones disciplinarias,"
echo -e " acciones legales o reporte a las autoridades competentes.${RESET}"
echo -e "${BOLD}${YELLOW}$(print_line '=')${RESET}"
```

---

## Paso 2: Activar el banner

Guardar el archivo y aplicar los permisos:

```bash
sudo nano /etc/profile.d/banner.sh
sudo chmod +x /etc/profile.d/banner.sh
```

---

## Paso 3: Verificar el funcionamiento

Cerrar sesión y volver a entrar:

```bash
exit
ssh usuario@servidor
```

Al iniciar sesión, el banner debe mostrarse automáticamente con la información del sistema y la advertencia de uso autorizado.
