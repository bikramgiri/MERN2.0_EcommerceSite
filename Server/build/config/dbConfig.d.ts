type DataBase = {
    host: string;
    user: string;
    password: string;
    db: string;
    dialect: 'mysql';
    pool: {
        max: number;
        min: number;
        idle: number;
        acquire: number;
    };
};
declare const dbConfig: DataBase;
export default dbConfig;
//# sourceMappingURL=dbConfig.d.ts.map