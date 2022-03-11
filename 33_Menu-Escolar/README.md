# 1. Project

Menú Escolar : an application that allows different schools to plan and deliver healthy menus to its students.

# 2. Prerequisites

* npm >= 6
* node >= 14
* postgresql >= 10


# 3. Packages intallation 

```
npm install
```

# 4. Database creation

Open a terminal and run the following code to load the database with the preset data:

```
psql -U postgres -f menu_escolar.sql
```

Open the `query.js` file and change the dummy credentials accordingly.

# 5. Run the application

```
node index.js
```

Open a browser and visit `localhost:3000`

# 6. User credentials

Admin:
```
email: admin@junaeb.cl
password: 12345678
```

School 1:
```
email: sanbosco@school.com
password: 123
```

School 2:
```
email: liceo32@school.com
password: 456
```


