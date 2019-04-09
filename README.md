# Instalacion

1. Instalar el programa git

2. Instalar el programa nodejs

3. Para instalar paquetes bower desde la consola es necesario cambiar la configuracion de git ya que por default usa el protocolo git:// y esta bloqueado, entonces reemplazar git por https, en cmd ejecutar:
	* git config --global url."https://".insteadOf git://

4. Para instalar todos los paquetes debe pedir accesos al CIT para que le den acceso libre y asi poder descargar todos los paquetes desde la consola
5. Instalar bower (gestor de paquetes de librerias para el frontend)
	* npm install -g bower

6. Instalar gulp
	* npm install -g gulp (automatizador de tareas)

7. bower install (instala los paquetes de front-end)
	* Si pregunta que version de angular usar seleccionar el numero de version mas grande (el mas reciente)

8. npm install (instala todos los paquetes de nodejs para automatizar el desarrollo)

9. Para iniciar la aplicacion puede ejecutar una de estas formas:
	* npm start
	* gulp
		* gulp (sin parametros genera el directorio build para empezar a desarrollar)
		* gulp dist (para compilar la aplicacion ya optimizada lista para subir a produccion)
