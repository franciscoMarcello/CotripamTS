import jwt from "jsonwebtoken"
import { Request, Response } from "express"
import { prismaClient } from "../../data/prismaClient"
import bcrypt from "bcrypt"

class UserControlersPost {
  static async allUsers(_req: Request, res: Response) {
    res.status(200).json({ message: "!" })
  }
  //CADASTRO E CRIAÇÃO DE TOKEN
  static async postUsers(_req: Request, res: Response) {
    const { id, nome, email, password, nivelAcesso } = _req.body

    if (!email) {
      res
        .status(422)
        .json({ message: "Email é obrigatorio para cadastro de usuario!" })
      return
    }
    const emailExist = await prismaClient.user.findUnique({ where: { email } })
    if (emailExist) {
      res
        .status(422)
        .json({ message: "Email já cadastratado, informe um email valido!" })
      return
    }
    const salt = await bcrypt.genSalt(12)
    const passwordHash = await bcrypt.hash(password, salt)
    const user = await prismaClient.user.create({
      data: {
        id,
        nome,
        email,
        password: passwordHash,
        nivelAcesso,
      },
    })
    const tokenUser = jwt.sign({ id: id }, process.env.SECRET as string)
    res.status(201).json({ id, nome, email, nivelAcesso, tokenUser })
  }
}

export default UserControlersPost
