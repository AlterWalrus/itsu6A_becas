#!/usr/bin/env python3

from pyfingerprint.pyfingerprint import PyFingerprint

try:
    sensor = PyFingerprint('/dev/serial0', 57600, 0xFFFFFFFF, 0x00000000)

    if not sensor.verifyPassword():
        raise ValueError('¡La contraseña del sensor de huellas es incorrecta!')

    count = sensor.getTemplateCount()
    if count == 0:
        print("No hay huellas que borrar.")
    else:
        print(f"Se encontraron {count} huellas. Borrando...")
        if sensor.clearDatabase():
            print("✔️ Memoria del sensor borrada exitosamente.")
        else:
            print("❌ No se pudo borrar la memoria del sensor.")

except Exception as e:
    print("⚠️ Error al intentar borrar la memoria del sensor.")
    print("Mensaje:", str(e))
