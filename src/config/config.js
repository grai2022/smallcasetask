module.exports = {
    port: 3000,
    DATABASE:'',
    DB_USER:'',
    DB_PASS:'',
    TIMEZONE:'Asia/Kolkata',
    PG_CONFIG:{
        dialect : 'postgres',
        host: '',
        port: '5432',
        pool:{
            max:30,
            min:6
        }
    }
};
