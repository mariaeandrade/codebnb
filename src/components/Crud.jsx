'use client';

import { App, Button, Flex, Form, Input, Modal, Popconfirm, Select, Space, Table } from 'antd';
import { useRouter } from 'next/navigation';
import { useState } from 'react';

export default function Crud({ titulo, colunas, campos, registros, salvar, excluir, busca }) {
    const [form] = Form.useForm();
    const [aberto, setAberto] = useState(false);
    const router = useRouter();
    const { message } = App.useApp();

    function abrir(registro = {}) {
        form.resetFields();
        form.setFieldsValue(registro);
        setAberto(true);
    }

    async function executar(acao, dados) {
        const resposta = await acao(dados);
        if (resposta?.erro) return message.error(resposta.erro);;
        message.success('Operação realizada');
        setAberto(false);
    }


    const acoes = {
        title: 'Ações',
        key: 'acoes',
        render: (_, registro) => (
            <Space>
                <Button size="small" onClick={() => abrir(registro)}>
                    Editar
                </Button>
                <Popconfirm
                title="Excluir este registro?"
                onConfirm={() => executar(excluir, registro.id)}>
                    <Button size='small' danger>
                        Excluir
                    </Button>
                </Popconfirm>
            </Space>
        ),
    }
  return (
        <Flex vertical gap={16}>
            <Flex justify="space-between" align="center" wrap gap={16}>
                <h1>{titulo}</h1>
                <Button type="primary" onClick={() => abrir()}>
                    Novo
                </Button>
            </Flex>

            {busca !== undefined && (
                <Input.Search
                    defaultValue={busca}
                    placeholder="Buscar por nome ou CPF"
                    enterButton="Buscar"
                    allowClear
                    onSearch={(termo) => router.push(`?busca=${encodeURIComponent(termo)}`)}
                />
            )}

            <Table
                rowKey="id"
                columns={[...colunas, acoes]}
                dataSource={registros}
                scroll={{ x: true }}
            />

            <Modal
                title={titulo}
                open={aberto}
                onCancel={() => setAberto(false)}
                onOk={form.submit}
                okText="Salvar"
                cancelText="Cancelar"
                forceRender>
                <Form form={form} layout="vertical" onFinish={(dados) => executar(salvar, dados)}>
                    <Form.Item name="id" hidden>
                        <Input />
                    </Form.Item>
                    {campos.map(({ name, label, opcoes, tipo, opcional }) => (
                        <Form.Item
                            key={name}
                            name={name}
                            label={label}
                            rules={[{ required: !opcional, message: 'Campo obrigatório' }]}
                            normalize={(valor) => valor || null}>
                            {opcoes ? <Select options={opcoes} /> : <Input type={tipo} />}
                        </Form.Item>
                    ))}
                </Form>
            </Modal>
        </Flex>
    );
}