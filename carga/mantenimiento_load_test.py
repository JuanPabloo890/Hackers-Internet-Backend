from locust import HttpUser, task, between, events
import random
import string

class MantenimientoUser(HttpUser):
    wait_time = between(1, 5)  # Tiempo de espera entre cada tarea en segundos

    def on_start(self):
        self.mantenimiento_ids = []
        self.equipo_ids = []

        # Inicializa IDs de prueba (puedes modificar esto para obtener IDs válidos desde tu API)
        self.initialize_ids()

    def initialize_ids(self):
        # Obtener todos los mantenimientos registrados
        response = self.client.get("/api/mantenimiento")
        if response.status_code == 200:
            mantenimientos = response.json()
            self.mantenimiento_ids = [m["id_unico"] for m in mantenimientos]
            self.equipo_ids = list(set([m["id_equipo"] for m in mantenimientos]))
        else:
            print(f"Error al obtener mantenimientos: {response.status_code}, {response.text}")

    @task
    def get_mantenimiento_by_id(self):
        if self.mantenimiento_ids:
            id_unico = random.choice(self.mantenimiento_ids)
            response = self.client.get(f"/api/mantenimiento/{id_unico}")
            if response.status_code == 200:
                print(f"Detalles del mantenimiento {id_unico} obtenidos exitosamente")
            else:
                print(f"Error al obtener mantenimiento {id_unico}: {response.status_code}, {response.text}")
        else:
            print("No hay mantenimientos registrados para obtener detalles")

    @task
    def get_mantenimientos_by_equipo_id(self):
        if self.equipo_ids:
            id_equipo = random.choice(self.equipo_ids)
            response = self.client.get(f"/api/mantenimiento/equipo/{id_equipo}")
            if response.status_code == 200:
                print(f"Mantenimientos del equipo {id_equipo} obtenidos exitosamente")
            else:
                print(f"Error al obtener mantenimientos del equipo {id_equipo}: {response.status_code}, {response.text}")
        else:
            print("No hay equipos registrados para obtener mantenimientos")

    @task
    def get_all_mantenimientos(self):
        response = self.client.get("/api/mantenimiento")
        if response.status_code == 200:
            print("Todos los mantenimientos obtenidos exitosamente")
        else:
            print(f"Error al obtener todos los mantenimientos: {response.status_code}, {response.text}")

