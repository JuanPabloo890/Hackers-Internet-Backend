from locust import HttpUser, task, between
import random
import string

class ClientUser(HttpUser):
    wait_time = between(1, 40)  # Tiempo de espera entre cada tarea en segundos
    cliente_ids = []  # Lista para almacenar los IDs de los clientes registrados

    def on_start(self):
        # Al inicio de la prueba, podrías generar algunos clientes automáticamente
        self.generar_clientes()

    def generate_unique_email(self):
        random_string = ''.join(random.choices(string.ascii_lowercase + string.digits, k=10))
        return f"cliente_{random_string}@ejemplo.com"

    def generar_clientes(self):
        # Generar y registrar 4 clientes en la base de datos
        for _ in range(4):
            email = self.generate_unique_email()
            payload = {
                "correo": email,
                "nombre": "Nombre Cliente",
                "telefono": "1234567890"
            }
            headers = {
                "Content-Type": "application/json"
            }
            response = self.client.post("/api/cliente", json=payload, headers=headers)
            if response.status_code == 200:
                cliente_id = response.json().get('id')  # Captura el ID del cliente registrado
                if cliente_id:
                    self.cliente_ids.append(cliente_id)  # Almacena el ID del cliente para uso futuro
                    print(f"Cliente registrado exitosamente con ID: {cliente_id}")
                else:
                    print(f"Error: No se recibió el ID del cliente en la respuesta: {response.text}")
            else:
                print(f"Error al registrar cliente: {response.status_code}, {response.text}")

    @task
    def ejecutar_tareas(self):
        self.registrar_cliente()
        self.detalle_cliente()
        self.actualizar_cliente()
        self.listar_clientes()
        self.eliminar_cliente()

    def registrar_cliente(self):
        email = self.generate_unique_email()
        payload = {
            "correo": email,
            "nombre": "Nombre Cliente",
            "telefono": "1234567890"
        }
        headers = {
            "Content-Type": "application/json"
        }
        response = self.client.post("/api/cliente", json=payload, headers=headers)
        if response.status_code == 200:
            cliente_id = response.json().get("id", None)
            if cliente_id:
                self.cliente_ids.append(cliente_id)  # Agrega el nuevo cliente a la lista de IDs
                print(f"Registro de cliente exitoso.")
            else:
                print("Error en el registro del cliente: No se recibió el ID del cliente.")
        else:
            print("Error en el registro del cliente:", response.status_code, response.text)

    def detalle_cliente(self):
        if self.cliente_ids:
            cliente_id = random.choice(self.cliente_ids)
            response = self.client.get(f"/api/cliente/{cliente_id}")
            if response.status_code == 200:
                print("Detalles del cliente obtenidos exitosamente")
            else:
                print("Error al obtener detalles del cliente:", response.status_code, response.text)
        else:
            print("No hay clientes registrados para obtener detalles.")

    def actualizar_cliente(self):
        if self.cliente_ids:
            cliente_id = random.choice(self.cliente_ids)
            payload = {
                "correo": "actualizado_cliente@ejemplo.com",
                "nombre": "Nombre Actualizado",
                "telefono": "0987654321"
            }
            headers = {
                "Content-Type": "application/json"
            }
            response = self.client.put(f"/api/cliente/{cliente_id}", json=payload, headers=headers)
            if response.status_code == 200:
                print("Actualización de cliente exitosa")
            else:
                print("Error en la actualización del cliente:", response.status_code, response.text)
        else:
            print("No hay clientes registrados para actualizar.")

    def eliminar_cliente(self):
        if self.cliente_ids:
            cliente_id = random.choice(self.cliente_ids)
            response = self.client.delete(f"/api/cliente/{cliente_id}")
            if response.status_code == 200:
                self.cliente_ids.remove(cliente_id)  # Elimina el cliente de la lista después de eliminarlo
                print("Eliminación de cliente exitosa")
            else:
                print("Error en la eliminación del cliente:", response.status_code, response.text)
        else:
            print("No hay clientes registrados para eliminar.")

    def listar_clientes(self):
        response = self.client.get("/api/clientes")
        if response.status_code == 200:
            print("Listado de clientes obtenido exitosamente")
        else:
            print("Error al listar los clientes:", response.status_code, response.text)

    def on_stop(self):
        # Llama al método para limpiar todos los clientes registrados al final de las pruebas
        self.limpiar_todos_los_clientes()

    def limpiar_todos_los_clientes(self):
        if self.cliente_ids:
            for cliente_id in self.cliente_ids:
                response = self.client.delete(f"/api/cliente/{cliente_id}")
                if response.status_code == 200:
                    print(f"Cliente {cliente_id} eliminado correctamente.")
                else:
                    print(f"Error al eliminar cliente {cliente_id}: {response.status_code}, {response.text}")
            self.cliente_ids.clear()
            print("Todos los clientes han sido eliminados.")
        else:
            print("No hay clientes registrados para limpiar.")

