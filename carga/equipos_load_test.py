from locust import HttpUser, task, between, events
import random
import string
import secrets

def generate_unique_id(prefix):
    random_string = ''.join(secrets.choice(string.ascii_uppercase + string.digits) for _ in range(6))
    return f"{prefix}{random_string}"

def generate_unique_email():
    random_string = ''.join(random.choices(string.ascii_lowercase + string.digits, k=10))
    return f"cliente_{random_string}@ejemplo.com"

class EquiposUser(HttpUser):
    wait_time = between(1, 5)  # Tiempo de espera entre cada tarea en segundos

    def on_start(self):
        self.client_ids = []
        self.equipo_ids = []
        self.step = 0

    def generate_random_client_id(self):
        return str(random.randint(1, 50))  # Genera un ID de cliente numérico

    def generate_equipo_id(self, tipo):
        prefix = ""
        if tipo.lower() == "impresora":
            prefix = "IMP"
        elif tipo.lower() == "laptop":
            prefix = "LAP"
        else:
            prefix = "EQU"
        
        return generate_unique_id(prefix)

    @task
    def ejecutar_tareas(self):
        if self.step == 0:
            self.generar_clientes()
        elif self.step == 1:
            self.asignar_equipos_a_clientes()
        elif self.step == 2:
            self.actualizar_equipo()
        elif self.step == 3:
            self.obtener_detalle_equipo()
        elif self.step == 4:
            self.eliminar_equipo()
        
        self.step = (self.step + 1) % 5  # Incrementa el paso y reinicia a 0 después de la última tarea

    def generar_clientes(self):
        # Generar y registrar 4 clientes en la base de datos
        for _ in range(4):
            email = generate_unique_email()
            payload = {
                "correo": email,
                "nombre": "Cliente Prueba",
                "telefono": "1234567891"
            }
            headers = {
                "Content-Type": "application/json"
            }
            response = self.client.post("/api/cliente", json=payload, headers=headers)
            if response.status_code in [200, 201]:
                cliente_id = response.json().get('id')  # Captura el ID del cliente registrado
                if cliente_id:
                    self.client_ids.append(cliente_id)
                    print(f"Cliente registrado exitosamente con ID: {cliente_id}")
                else:
                    print(f"Error: No se recibió el ID del cliente en la respuesta: {response.text}")
            else:
                print(f"Error al registrar cliente: {response.status_code}, {response.text}")

    def asignar_equipos_a_clientes(self):
        if not self.client_ids:
            print("No hay clientes generados para asignar equipos")
            return

        # Asignar equipos a cada cliente generado
        for id_cliente in self.client_ids:
            equipo_id = self.generate_equipo_id("laptop")
            payload = {
                "marca": "Lenovo",
                "modelo": "ThinkPad",
                "estado": "Nuevo",
                "id_cliente": id_cliente,
                "observaciones": "Sin observaciones",
                "tipo": "laptop"
            }
            headers = {
                "Content-Type": "application/json"
            }
            response = self.client.post("/api/equipo", json=payload, headers=headers)
            if response.status_code in [200, 201]:
                equipo_id = response.json().get('id')  # Captura el ID del equipo registrado
                if equipo_id:
                    self.equipo_ids.append(equipo_id)  # Almacena el ID para uso futuro
                    print(f"Equipo registrado exitosamente para el cliente {id_cliente} con ID: {equipo_id}")
                else:
                    print(f"Error: No se recibió el ID del equipo en la respuesta: {response.text}")
            else:
                print(f"Error al registrar equipo para el cliente {id_cliente}: {response.status_code}, {response.text}")

    def actualizar_equipo(self):
        if not self.equipo_ids:
            print("No hay equipos registrados para actualizar")
            return

        equipo_id = random.choice(self.equipo_ids)
        id_cliente = random.choice(self.client_ids) if self.client_ids else self.generate_random_client_id()
        payload = {
            "marca": "Dell",
            "modelo": "Latitude",
            "estado": "Usado",
            "id_cliente": id_cliente,
            "observaciones": "Actualización de observaciones",
            "tipo": "laptop"
        }
        headers = {
            "Content-Type": "application/json"
        }
        response = self.client.put(f"/api/equipo/{equipo_id}", json=payload, headers=headers)
        if response.status_code == 200:
            print(f"Actualización de equipo {equipo_id} exitosa")
        else:
            print(f"Error en la actualización de equipo {equipo_id}: {response.status_code}, {response.text}")

    def obtener_detalle_equipo(self):
        if not self.equipo_ids:
            print("No hay equipos registrados para obtener detalles")
            return

        equipo_id = random.choice(self.equipo_ids)
        response = self.client.get(f"/api/equipo/{equipo_id}")
        if response.status_code == 200:
            print(f"Detalles del equipo {equipo_id} obtenidos exitosamente")
        else:
            print(f"Error al obtener detalles del equipo {equipo_id}: {response.status_code}, {response.text}")

    def eliminar_equipo(self):
        if not self.equipo_ids:
            print("No hay equipos registrados para eliminar")
            return

        equipo_id = random.choice(self.equipo_ids)
        response = self.client.delete(f"/api/equipo/{equipo_id}")
        if response.status_code == 200:
            self.equipo_ids.remove(equipo_id)  # Elimina el ID del equipo de la lista después de eliminarlo
            print(f"Eliminación de equipo {equipo_id} exitosa")
        else:
            print(f"Error en la eliminación de equipo {equipo_id}: {response.status_code}, {response.text}")

