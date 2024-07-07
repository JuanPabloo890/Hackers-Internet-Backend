#PARA EJECUTAR CADA PRUEBA DENTRO DE LA CARPETA CARGA: locust -f admin_load_test.py --host=http://localhost:3000

from locust import HttpUser, task, between

class AdminUser(HttpUser):
    wait_time = between(1, 3)  # Tiempo de espera entre cada tarea en segundos

    @task
    def login_admin(self):
        payload = {
            "correo": "nuevo_correo@ejemplo.com",
            "password": "nueva_password"
        }
        headers = {
            "Content-Type": "application/json"
        }
        response = self.client.post("/api/admin/login", json=payload, headers=headers)
        if response.status_code == 200:
            print("Login exitoso")
        else:
            print("Error en el login:", response.status_code, response.text)

    @task
    def actualizar_admin(self):
        payload = {
            "correo": "nuevo_correo@ejemplo.com",
            "nombre": "Nuevo Nombre",
            "telefono": "0987654321",
            "password": "nueva_password"
        }
        headers = {
            "Content-Type": "application/json"
        }
        response = self.client.put("/api/admin/1", json=payload, headers=headers)  # Ajusta el ID según tu aplicación
        if response.status_code == 200:
            print("Actualización de administrador exitosa")
        else:
            print("Error en la actualización:", response.status_code, response.text)

    @task
    def recuperar_password(self):
        payload = {
            "correo": "nuevo_correo@ejemplo.com"
        }
        headers = {
            "Content-Type": "application/json"
        }
        response = self.client.post("/api/admin/recuperar-password", json=payload, headers=headers)
        if response.status_code == 200:
            print("Recuperación de contraseña exitosa")
        else:
            print("Error en la recuperación de contraseña:", response.status_code, response.text)
