#!/usr/bin/env python3
from pyfingerprint.pyfingerprint import PyFingerprint
import time
import mysql.connector
import os

try:
    sensor = PyFingerprint('/dev/serial0', 57600, 0xFFFFFFFF, 0x00000000)
    if not sensor.verifyPassword():
        raise ValueError('Contraseña del sensor incorrecta.')

except Exception as e:
    print(f"[ERROR] No se pudo inicializar el sensor: {e}")
    exit(1)

print("[INFO] Sensor de huellas activo. Esperando huellas...")

while True:
    try:
		#Saltar
        if os.path.exists('/var/www/html/itsu6A_becas/lector_en_uso.lock'):
            time.sleep(1)
            print("[INFO] PAUSA")
            continue
		
		#Leer
        if sensor.readImage():
            sensor.convertImage(0x01)
            result = sensor.searchTemplate()
            posicion = result[0]
            if posicion == -1:
                print("[INFO] Huella no reconocida.")
            else:
                print(f"[INFO] Huella reconocida en la posición #{posicion}")

                conn = mysql.connector.connect(
                    host='localhost',
                    user='root',
                    password='',
                    database='checktec'
                )
                cursor = conn.cursor(dictionary=True)
                cursor.execute("SELECT * FROM alumno WHERE Huella = %s;", (posicion,))
                alumno = cursor.fetchone()
                cursor.close()
                conn.close()
                
                path = '/var/www/html/itsu6A_becas/portal-alumno/deteccion_actual.json'

                if alumno:
                    with open(path, 'w') as f:
                        import json
                        alumno['huella_detectada'] = True
                        json.dump(alumno, f)
                        

                    print(f"[INFO] Alumno detectado: {alumno['Nombre']}")
                else:
                    print("[INFO] Huella válida pero alumno no activo o no existe.")
            time.sleep(2)

    except Exception as e:
        print(f"[ERROR] {e}")
        time.sleep(2)
