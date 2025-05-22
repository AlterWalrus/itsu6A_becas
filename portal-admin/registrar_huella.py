#!/usr/bin/env python3
from pyfingerprint.pyfingerprint import PyFingerprint
import time
import json
import sys
import os

timeout = 10
LOCK_PATH = '/var/www/html/itsu6A_becas/lector_en_uso.lock'

def output_json(success, message):
    print(json.dumps({'exito': success, 'mensaje': message}))

# Crear archivo de bloqueo
try:
    open(LOCK_PATH, 'w').close()
    time.sleep(2)
except Exception as e:
    output_json(False, f"No se pudo crear lock: {e}")
    sys.exit(1)

try:
    sensor = PyFingerprint('/dev/serial0', 57600, 0xFFFFFFFF, 0x00000000)
    if not sensor.verifyPassword():
        raise ValueError('La contraseña del sensor de huellas es incorrecta.')

    # Primer escaneo
    start_time = time.time()
    while not sensor.readImage():
        if time.time() - start_time > timeout:
            output_json(False, "Tiempo de espera agotado. No se detectó la huella.")
            sys.exit(0)
    sensor.convertImage(0x01)

    result = sensor.searchTemplate()
    position_number = result[0]
    if position_number >= 0:
        output_json(False, 'La huella ya está registrada.')
        sys.exit(0)

    time.sleep(2)

    # Segundo escaneo
    start_time = time.time()
    while not sensor.readImage():
        if time.time() - start_time > timeout:
            output_json(False, "Tiempo de espera agotado. No se detectó la huella.")
            sys.exit(0)
    sensor.convertImage(0x02)

    if sensor.compareCharacteristics() == 0:
        raise Exception('Las huellas no coinciden.')

    sensor.createTemplate()
    position_number = sensor.storeTemplate()
    
    output_json(True, position_number)

except Exception as e:
    output_json(False, 'Error al registrar la huella: ' + str(e))
    sys.exit(1)

finally:
    # Eliminar archivo de bloqueo
    if os.path.exists(LOCK_PATH):
        os.remove(LOCK_PATH)
