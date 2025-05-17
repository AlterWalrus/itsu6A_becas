#!/usr/bin/env python3
from pyfingerprint.pyfingerprint import PyFingerprint
import time
import json
import sys

def output_json(success, message):
    #print('Content-Type: application/json\n')
    print(json.dumps({'exito': success, 'mensaje': message}))

try:
    sensor = PyFingerprint('/dev/serial0', 57600, 0xFFFFFFFF, 0x00000000)

    if not sensor.verifyPassword():
        raise ValueError('La contraseña del sensor de huellas es incorrecta.')

except Exception as e:
    output_json(False, 'No se pudo inicializar el sensor: ' + str(e))
    sys.exit(1)

try:
    # Primer escaneo
    while not sensor.readImage():
        pass
    sensor.convertImage(0x01)

    result = sensor.searchTemplate()
    position_number = result[0]
    if position_number >= 0:
        output_json(False, f'La huella ya está registrada en la posición #{position_number}')
        sys.exit(0)

    time.sleep(2)

    # Segundo escaneo
    while not sensor.readImage():
        pass
    sensor.convertImage(0x02)

    if sensor.compareCharacteristics() == 0:
        raise Exception('Las huellas no coinciden.')

    sensor.createTemplate()
    position_number = sensor.storeTemplate()

    output_json(True, f'Huella registrada correctamente en la posición #{position_number}')

except Exception as e:
    output_json(False, 'Error al registrar la huella: ' + str(e))
    sys.exit(1)
