import { sair } from '@actions/login';
import { Button, Flex } from 'antd';
import jwt from 'jsonwebtoken';
import { cookies } from 'next/headers';
import Link from 'next/link';

const estilo = { padding: 16, borderBottom: '1px solid lightgray' };

export default async function Header() {
    const token = (await cookies()).get('token')?.value;
    const usuario = token  && jwt.decode(token);
    if (!usuario) return null ;

    return (
        <Flex
        component="header"
        style={estilo}
        justify='space-between'
        wrap
        gap={16}>
            <Flex gap={16} component="nav">
                <Link href="/inicio"> Início</Link>
                <Link href="/clientes"> Clientes</Link>
                <Link href="/imoveis"> Imoveis</Link>
                <Link href="/alugueis"> Alugueis</Link>
            </Flex>
            <Flex gap={16} align='center'>
                <span> Olá</span>
                <form action={sair}>
                    <Button htmlType='submit'>Sair</Button>
                </form>
            </Flex>
        </Flex>
    )
}