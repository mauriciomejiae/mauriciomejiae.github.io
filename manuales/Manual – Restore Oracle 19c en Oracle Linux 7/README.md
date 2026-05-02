# Manual – Restore Oracle 19c en Oracle Linux 7

![Status](https://img.shields.io/badge/Status-Migrado-success?style=flat-square)
![Type](https://img.shields.io/badge/Type-Manual_Técnico-blue?style=flat-square)
![Last Updated](https://img.shields.io/badge/Date-2026-lightgrey?style=flat-square)

---

Restauración completa de Oracle 19c desde Data Protector (RMAN) en Oracle Linux 7.

---

## 🔹 Paso 1: Ajustar permisos del directorio Oracle

Ejecutar como root:

```bash
chown -R ora19c:dba /u01/app/oracle
```

---

## 🔹 Paso 2: Configurar las variables de entorno

Ingresar como usuario `ora19c` y ejecutar:

```bash
export ORACLE_SID=PRUEBAS
export ORACLE_HOME=/u01/app/oracle/product/19.0.0/dbhome_1
export ORACLE_BASE=/u01/app/oracle
export PATH=$ORACLE_HOME/bin:$PATH
```

Verificar:

```bash
echo $ORACLE_SID
echo $ORACLE_HOME
```

Debe mostrar:

```
PRUEBAS
/u01/app/oracle/product/19.0.0/dbhome_1
```

---

## 🔹 Paso 3: Crear el PFILE mínimo

Crear el archivo `$ORACLE_HOME/dbs/initPRUEBAS.ora` con el contenido:

```
db_name=PRUEBAS
memory_target=2G
processes=300
diagnostic_dest='/u01/app/oracle'
control_files='/u01/app/oracle/oradata/PRUEBAS/control01.ctl','/u01/app/oracle/oradata/PRUEBAS/control02.ctl'
```

Los controlfiles NO deben existir aún; serán restaurados desde Data Protector.

![PFILE creado](assets/image1.png)

---

## 🔹 Paso 4: Levantar la instancia en NOMOUNT

```sql
sqlplus / as sysdba
STARTUP NOMOUNT PFILE='$ORACLE_HOME/dbs/initPRUEBAS.ora';
```

Salida esperada:

```
ORACLE instance started.

Total System Global Area  2147481656 bytes
Fixed Size                   8898616 bytes
Variable Size             1207959552 bytes
Database Buffers           922746880 bytes
Redo Buffers                 7876608 bytes
```

Si ves `ORACLE instance started.`, la instancia vacía está lista para restaurar la BD PRUEBAS.

---

## 🔹 Paso 5: Conexión a RMAN

Desde el usuario `ora19c`:

```bash
rman target /
```

Ejemplo de salida:

```
connected to target database: PRUEBAS (not mounted)
```

---

## 🔹 Paso 6: Restaurar el Control File desde Data Protector

Ejecutar en RMAN:

```sql
run {
  allocate channel 'dev_0' type 'sbt_tape'
  parms 'SBT_LIBRARY=/opt/omni/lib/libob2oracle8_64bit.so,ENV=(OB2BARTYPE=Oracle8,OB2APPNAME=PRUEBAS,OB2BARLIST=ORACLE_PRUEBAS_FULL,OB2BARHOSTNAME=oraclerestore.homelab.local)';
  set until time "to_date('25/10/25 14:18:37','DD/MM/YY HH24:MI:SS')";
  restore controlfile from 'c-3366633431-20251125-00';
  release channel 'dev_0';
}
```

RMAN Log:

```
allocated channel: dev_0
channel dev_0: SID=20 device type=SBT_TAPE
channel dev_0: Omniback/168

executing command: SET until clause

Starting restore at 25-NOV-25
channel dev_0: restoring control file
channel dev_0: restore complete, elapsed time: 00:00:59
output file name=/u01/app/oracle/oradata/PRUEBAS/control01.ctl
output file name=/u01/app/oracle/oradata/PRUEBAS/control02.ctl
Finished restore at 25-NOV-25

released channel: dev_0
```

Explicación de cada instrucción:

| Instrucción                | Descripción                                                       |
| :------------------------- | :---------------------------------------------------------------- |
| `allocate channel`         | Crea el canal RMAN hacia el agente Oracle de Data Protector (SBT) |
| `SBT_LIBRARY`              | Biblioteca para comunicación RMAN ↔ DP                            |
| `OB2BARTYPE`               | Tipo de integración (Oracle8)                                     |
| `OB2APPNAME`               | Nombre de la BD                                                   |
| `OB2BARLIST`               | Nombre del backup en DP                                           |
| `OB2BARHOSTNAME`           | Servidor donde se ejecuta el restore                              |
| `set until time`           | Define el Point In Time Recovery (PITR)                           |
| `restore controlfile from` | Restaura el controlfile desde el backup especificado              |
| `release channel`          | Libera el canal SBT                                               |

---

## 🔹 Paso 7: Montar la base de datos

En SQL\*Plus (como usuario `ora19c`):

```sql
ALTER DATABASE MOUNT;
```

Salida esperada: `Database altered.`

Verificación opcional:

```sql
SELECT instance_name, status FROM v$instance;
```

```
INSTANCE_NAME    STATUS
----------------  ----------------
PRUEBAS          MOUNTED
```

---

## 🔹 Paso 8: Verificar datafiles y logfiles (opcional)

Con la base en MOUNTED:

```sql
SELECT file#, name, status FROM v$datafile;
SELECT member FROM v$logfile;
```

Confirmar que las rutas coinciden con `/u01/app/oracle/oradata/PRUEBAS/...`

---

## 🔹 Paso 9: Listar respaldos Full de la BD

En RMAN:

```sql
list backup of database summary;
```

Ejemplo de salida:

```
Key  TY LV S Device Type  Completion Time  #Pieces  #Copies  Compressed  Tag
---- -- -- - -----------  ---------------  -------  -------  ----------  ---
1    B  0  A SBT_TAPE     15-NOV-25        1        1        NO          TAG20251115T153204
2    B  0  A SBT_TAPE     15-NOV-25        1        1        NO          TAG20251115T153204
96   B  0  A SBT_TAPE     25-NOV-25        1        1        NO          TAG20251125T141642
97   B  0  A SBT_TAPE     25-NOV-25        1        1        NO          TAG20251125T141642
98   B  0  A SBT_TAPE     25-NOV-25        1        1        NO          TAG20251125T141642
99   B  0  A SBT_TAPE     25-NOV-25        1        1        NO          TAG20251125T141642
```

---

## 🔹 Paso 10: Restaurar los DATAFILES usando TAG

Restaura únicamente los datafiles (sin recovery, sin PITR). La BD quedará en MOUNT esperando recuperación posterior.

Ejecutar en RMAN:

```sql
run {
  allocate channel 'dev_0' type 'sbt_tape'
  parms 'SBT_LIBRARY=/opt/omni/lib/libob2oracle8_64bit.so,ENV=(OB2BARTYPE=Oracle8,OB2APPNAME=PRUEBAS,OB2BARLIST=ORACLE_PRUEBAS_FULL,OB2BARHOSTNAME=oraclerestore.homelab.local)';
  restore database from tag 'TAG20251125T141642';
  switch datafile all;
  release channel 'dev_0';
}
```

RMAN Log:

```
allocated channel: dev_0
channel dev_0: SID=12 device type=SBT_TAPE
channel dev_0: Omniback/168

Starting restore at 25-NOV-25

channel dev_0: starting datafile backup set restore
channel dev_0: restoring datafile 00001 to /u01/app/oracle/oradata/PRUEBAS/datafile/o1_mf_system_nkklwoqw_.dbf
channel dev_0: restore complete, elapsed time: 00:01:05

channel dev_0: restoring datafile 00003 to /u01/app/oracle/oradata/PRUEBAS/datafile/o1_mf_sysaux_nkklxgsp_.dbf
channel dev_0: restore complete, elapsed time: 00:00:45

channel dev_0: restoring datafile 00004 to /u01/app/oracle/oradata/PRUEBAS/datafile/o1_mf_undotbs1_nkklxxtw_.dbf
channel dev_0: restore complete, elapsed time: 00:00:45

channel dev_0: restoring datafile 00007 to /u01/app/oracle/oradata/PRUEBAS/datafile/o1_mf_users_nkklxyvt_.dbf
channel dev_0: restore complete, elapsed time: 00:00:45

Finished restore at 25-NOV-25
released channel: dev_0
```

---

## 🔹 Paso 11: Consultar los archivelogs catalogados en RMAN

Antes de restaurar, validar qué archivos RMAN tiene registrados:

```sql
list archivelog all;
```

Ejemplo de salida:

```
Key   Thrd  Seq    S  Low Time
----- ----  -----  -  ---------
140   1     93     A  15-NOV-25
  Name: /u01/app/oracle/product/19.3.0/dbhome_1/dbs/arch1_93_1217253145.dbf
144   1     94     A  15-NOV-25
  Name: /u01/app/oracle/product/19.3.0/dbhome_1/dbs/arch1_94_1217253145.dbf
...
153   1     106    A  15-NOV-25
  Name: /u01/app/oracle/product/19.3.0/dbhome_1/dbs/arch1_106_1217253145.dbf
```

---

## 🔹 Paso 12: Restaurar archivelogs por rango de sequence

Si conoces el thread y el rango de sequence, RMAN permite restaurar solo los archivos necesarios.

Restaurar del 93 al 106, thread 1:

```sql
run {
  allocate channel dev_0 type 'sbt_tape'
  parms 'SBT_LIBRARY=/opt/omni/lib/libob2oracle8_64bit.so,
  ENV=(OB2BARTYPE=Oracle8,OB2APPNAME=PRUEBAS,
  OB2BARLIST=ORACLE_PRUEBAS_FULL,
  OB2BARHOSTNAME=oraclerestore.homelab.local)';
  restore archivelog
    from sequence 93
    until sequence 106
    thread 1;
  release channel dev_0;
}
```

RMAN Log:

```
allocated channel: dev_0
channel dev_0: SID=18 device type=SBT_TAPE
channel dev_0: Omniback/168

Starting restore at 25-NOV-25
channel dev_0: starting archived log restore to default destination
channel dev_0: restoring archived log
  archived log thread=1 sequence=93 ... sequence=106
channel dev_0: restore complete

Finished restore at 25-NOV-25
released channel: dev_0
```

---

## 🔹 Paso 13: Abrir la base en modo RESETLOGS

En SQL\*Plus:

```sql
ALTER DATABASE OPEN RESETLOGS;
```

- Abre la base incluso si ya no hay más archivelogs disponibles
- Reinicia los redo logs
- Marca la base como consistente hasta el último archivelog aplicado

---

## 🔹 Paso 14: Verificar el estado de la base y datafiles

```sql
SELECT name, status FROM v$datafile;
SELECT sequence#, applied FROM v$archived_log ORDER BY sequence#;
```

- `v$datafile` → Debe mostrar todos los datafiles en ONLINE
- `v$archived_log` → Indica hasta qué sequence fueron aplicados los archivelogs

---

## 🔹 Paso 15: Confirmar el modo de apertura

```sql
SELECT name, status FROM v$datafile;
```

Todos los datafiles deben aparecer como ONLINE.

```sql
SELECT open_mode FROM v$database;
```

Debe retornar: `READ WRITE`

---

## 🔹 Paso 16: Aplicar CROSSCHECK y RESYNC en RMAN

Conectarse a RMAN:

```bash
rman target /
```

Ejecutar CROSSCHECK de backups y archivelogs:

```sql
CROSSCHECK BACKUP;
CROSSCHECK ARCHIVELOG ALL;
```

- `BACKUP` → Verifica backups de datafiles, controlfile, spfile
- `ARCHIVELOG ALL` → Valida todos los archivelogs registrados por RMAN

Limpiar los elementos expirados:

```sql
DELETE EXPIRED BACKUP;
DELETE EXPIRED ARCHIVELOG ALL;
```

Esto solo elimina registros, no archivos válidos.

Ejecutar RESYNC del Recovery Catalog (solo si aplica):

```sql
RESYNC CATALOG;
```

> Este paso actualiza los metadatos del catálogo con el estado real de los backups. Si NO usas recovery catalog y solo manejas control file, este paso no es necesario.
