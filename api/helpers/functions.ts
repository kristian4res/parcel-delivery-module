export const checkEnvVars = (vars: string[]): boolean[] => {
    return vars.map(variable => {
        if (!process.env[variable]) {
            console.error(`${variable} is undefined`);
            return false;
        }
        return true;
    });
};

export const formatDateInMySQL = (date: Date) => {
    return date.toISOString().slice(0, 19).replace('T', ' ');
};