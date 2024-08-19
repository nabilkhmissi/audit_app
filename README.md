to run the project : 
    - run the DB:
        install docker to run the db,
        cd /project_folder then docker-compose up -d
    - run the backend server : 
        create .env file in /project_folder/back
        copy everything from  /project_folder/back/.env-exemple and paste it in .env
        replace configurations in .env (CONNECTION_STRING, PORT, ...)
        create  /static/images folder under /project_folder/src/
        make sure you're in /project_folder/back and run npm install then npm start
    - run the frontend
        make sure angular is installed
        cd /project_folder/front
        run npm install --legacy-peers-deps 
        run ng s
