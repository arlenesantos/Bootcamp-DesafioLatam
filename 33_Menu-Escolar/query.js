const pg = require("pg");
pg.types.setTypeParser(1082, (stringValue) => stringValue);

const pool = new pg.Pool ({
    user: "postgres", 
    password: "xxxxx", 
    host: "localhost",
    port: 5432,
    database: "menu", // suggested name
});


const isAdmin = async (email, password) => {
    let query = {
        text: `SELECT email FROM admin WHERE email = $1 AND password = $2;`,
        values: [email, password],
    };
    try {
        let result = await pool.query(query);        
        return result.rows[0];

    } catch (error) {
        console.log(error);
        return false;
    }

}

const isSchool = async (email, password) => {
    let query = {
        text: `SELECT id, name, school, email FROM schools WHERE email = $1 AND password = $2;`,
        values: [email, password],
    };
    try {
        let result = await pool.query(query);        
        return result.rows[0];

    } catch (error) {
        console.log(error);
        return false;
    }
}

const newSchool = async (name, school, email, password) => {
    const consulta = {
        text: "INSERT INTO schools (name, school, email, password) VALUES ($1,$2,$3,$4) RETURNING *;",
        values: [name, school, email, password],
    };
    try {
        const result = await pool.query(consulta);
        return result.rows[0];
    } catch (error) {
        throw error;
    }
};

const newOrder = async (date, school_id, vegetarian, celiac, standard, caloric, ethnic) => {
    const consulta = {
        text: "INSERT INTO orders (date, is_rectified, observations, school_id, vegetarian, celiac, standard, caloric, ethnic) VALUES ($1,$2,$3,$4,$5,$6,$7,$8,$9) RETURNING *;",
        values: [date, false, null, school_id, vegetarian, celiac, standard, caloric, ethnic],
    };
    try {
        const result = await pool.query(consulta);
        return result.rows[0];
    } catch (error) {
        throw error;
    }
};

const allOrders = async (school_id) => {
    const consulta = {
        text: "SELECT id, to_char(date, 'DD/MM/YYYY') as date, is_rectified, observations, school_id, vegetarian, vegetarian_real, celiac, celiac_real, standard, standard_real, caloric, caloric_real, ethnic, ethnic_real FROM orders WHERE school_id = $1 ORDER BY date DESC",
        values: [school_id],
    };
    try {
        const result = await pool.query(consulta);
        return result.rows;
    } catch (error) {
        throw error;
    }
};

const getOrder = async (id) => {
    const consulta = {
        text: "SELECT id, to_char(date, 'DD/MM/YYYY') as date, is_rectified, observations, school_id, vegetarian, vegetarian_real, celiac, celiac_real, standard, standard_real, caloric, caloric_real, ethnic, ethnic_real, (vegetarian + celiac + standard + caloric + ethnic) - (vegetarian_real + celiac_real + standard_real + caloric_real + ethnic_real) AS lost FROM orders WHERE id = $1",
        values: [id],
    };
    try {
        const result = await pool.query(consulta);
        return result.rows[0];
    } catch (error) {
        throw error;
    }
};

const rectify = async (id, observations, vegetarian, celiac, standard, caloric, ethnic) => {
    const consulta = {
        text: "UPDATE orders SET is_rectified = true, observations = $2, vegetarian_real = $3,  celiac_real = $4, standard_real = $5, caloric_real = $6, ethnic_real = $7 WHERE id = $1 RETURNING *;",
        values: [id, observations, vegetarian, celiac, standard, caloric, ethnic ],
    };
    try {
        const result = await pool.query(consulta);
        return result.rows[0];
    } catch (error) {
        throw error;
    }
};

const allOrdersAdmin = async () => {    
    try {
        const result = await pool.query(`SELECT orders.id, to_char(date, 'DD/MM/YYYY') as date, is_rectified, observations, school_id, vegetarian, vegetarian_real, celiac, celiac_real, standard, standard_real, caloric, caloric_real, ethnic, ethnic_real, schools.school as school_name FROM orders
        LEFT JOIN schools ON orders.school_id = schools.id 
        ORDER BY date DESC`);
        return result.rows;
    } catch (error) {
        throw error;
    }
};

const getSchools = async () => {    
    try {
        const result = await pool.query(`SELECT id, name, school, email FROM schools`);
        return result.rows;
    } catch (error) {
        throw error;
    }
};

const filterOrder = async (school, initialDate, untilDate) => {    
    const consulta = {
        text: ` SELECT schools.id, orders.id, orders.date, is_rectified, observations, school_id, vegetarian, vegetarian_real, celiac, celiac_real, standard, standard_real, caloric, caloric_real, ethnic, ethnic_real, schools.school as school_name FROM orders
        LEFT JOIN schools ON orders.school_id = schools.id
        WHERE schools.id = $1 AND orders.date BETWEEN $2 AND $3; `,                
                        
        values: [school, initialDate, untilDate ],
    };
    try {
        const result = await pool.query(consulta);
        return result.rows;
    } catch (error) {
        throw error;
    }
};

const saveNews = async (title, content) => {
    const consulta = {
        text: "INSERT INTO noticias (title, content) VALUES ($1, $2) RETURNING *;",
        values: [title, content],
    };
    try {
        const result = await pool.query(consulta);
        return result.rows[0];
    } catch (error) {
        throw error;
    }

}

const latestNews = async () => {
    try {
        const result = await pool.query(`SELECT title, to_char(date, 'DD/MM/YYYY') AS date, content FROM noticias ORDER BY id DESC LIMIT 5;`);
        return result.rows;
    } catch (error) {
        throw error;
    }

}








module.exports = {
    isAdmin,
    isSchool,
    newSchool,
    newOrder,
    allOrders,
    getOrder,
    rectify,
    allOrdersAdmin,
    getSchools,
    filterOrder, 
    saveNews,
    latestNews,       
}

