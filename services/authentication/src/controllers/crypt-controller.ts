import bcrypt from 'bcrypt'

async function cryptPassword(password: string) {
    const salt = await bcrypt.genSalt(12)
    const cryptedPassword = bcrypt.hash(password, salt)
    return cryptedPassword;
}

async function comparePassword(cryptedPassword: string, password: string){
    const passwordEqual = bcrypt.compareSync(password, cryptedPassword)
    return passwordEqual
}

export {cryptPassword, comparePassword}