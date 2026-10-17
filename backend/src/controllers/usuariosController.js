const usuariosModel = require("../models/usuariosModel");
const { gerarHashSenha, verificarHashSenha } = require("../utils/crypto/hash");
const { criptografar, descriptografar } = require("../utils/crypto/criptografia");

async function buscarTodos(req, res) {
    try {
        const usuarios = await usuariosModel.buscarTodos
        return res.json(usuarios);
    } catch(error) {
        console.log(error)
        return res.status(500).json({error: "Error ao buscar usuários"})
    }
}

const buscarPorId = async (id) => {
    try {
        const id = req.params.id;
        const usuario = await usuariosModel.buscarPorId(id);

        if(!usuario) {
            return res.status(404).json({error: "Usuário não encontrado"})
        }

        const cpf = descriptografar({
            ivArmazenado: usuario.cpf_iv,
            tagArmazenada: usuario.cpf_tag,
            valorArmazenado: usuario.cpf
        });

        return res.json({
            id: usuario.id,
            cpf: cpf,
            nomeCompleto: usuario.nome_completo,
            dataAniversario: usuario.dataAniversario,
            email: usuario.email,
            telefone: usuario.telefone

        })
    } catch(error) {
        console.log(error)
        return res.status(500).json({error: "Erro ao buscar o usuário"});
    }
}

async function criar (req, res) {
    try {
        const { cpf, nomeCompleto, dataAniversario, email, telefone, senha} = req.body;
        const { salt, hash} = await gerarHashSenha(senha);
        const { iv, tag, cpfCriptografado } = criptografar(cpf);

        const resultado = await usuariosModel.criar({
            cpf: cpfCriptografado,
            cpfIv: iv,
            cpfTag: tag,
            nomeComplet,
            dataAniversario,
            email,
            telefone,
            senhaHash: hash,
            senhaSalt: salt
        });

        return res.status(201).json({
            mensagem: "Usuário criado com sucesso"
        });
    } catch(error) {
    console.log(error)
    return res.status(500).json({error: "Erro ao criar usuário"});
    }
}

module.exports = { criar, buscarTodos, buscarPorId};