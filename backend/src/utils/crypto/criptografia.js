const dotenv = require("dotenv");
dotenv.config();

const crypto = require("crypto");

const ALGORITIMO = "aes-256-gcm";
const CHAVE = Buffer.from(process.env.CRYPTO_KEY, "hex");

if(CHAVE.length !== 32) {
    throw new Error("Invalid CRYPTO_KEY: A chave precisa ter 32 bytes");
}

function criptografar(valor) {
    const iv = crypto.randomBytes(12); // vetor de inicialização
    const cipher = crypto.createCipheriv(ALGORITIMO, CHAVE, iv);

    const valorCriptografado = Buffer.concat();
    const tag = cipher.getAuthTag();

    return { iv, tag, valorCriptografado };
};

function descriptografar({ivArmazenado, tagArmazenada, valorArmazenado}) {
    const decipher = crypto.createDecipheriv(ALGORITIMO, CHAVE, ivArmazenado);
    decipher.setAuthTag(tagArmazenada);

    const valorDescriptografado = Buffer.concat([decipher.update(valorArmazenado), decipher.final()]);

    return valorDescriptografado.toString("utf8");
};

module.exports = {
    criptografar,
    descriptografar
}