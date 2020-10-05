module.exports = {
    port: 3000,
    DATABASE:'small',
    DB_USER:'postgres',
    DB_PASS:'small123',
    TIMEZONE:'Asia/Kolkata',
    PG_CONFIG:{
        dialect : 'postgres',
        host: 'smallcase.cb6ry9j2kg1w.ap-south-1.rds.amazonaws.com',
        port: '5432',
        pool:{
            max:30,
            min:6
        }
    }
};
