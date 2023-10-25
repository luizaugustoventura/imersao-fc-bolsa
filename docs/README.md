## Informações e instruções importantes

1. Para que o Docker possa resolver o **host.docker.internal**, é necessário incluir o endereço **127.17.0.1** no **/etc/hosts** da sua máquina.

    *Obs: No Windows, você vai encontrar este arquivo no seguinte diretório **C:\Windows\System32\drivers\etc***

    A seguinte linha deve ser inserida ao final do arquivo:

    `172.17.0.1 host.docker.internal`

2. Ainda pode ser que você venha a ter um problema relacionado ao consumo de memória pelo Docker, caso esteja utilizando WSL (Windows Subsystem for Linux). Neste caso, execute o seguinte comando dentro do seu Linux:

    `sudo sysctl -w vm.max_map_count=262144`

    *Você pode aumentar ou diminuir o valor, caso achar necessário.*

## Executando aplicação localmente

1. Antes de qualquer coisa, é importante subir o container do Apache Kafka e esperar ele entrar em execução. Para isso, basta entrar no diretório ***/go*** e executar `docker compose up -d`
2. Agora, execute o microserviço Golang, executando um `go run cmd/trade/main.go`. Pode ser necessário executar um `go mod tidy`, caso ainda não tenha os módulos utilizados neste microserviço. *Obs: Como já tinha a linguagem Go configurada na minha máquina, continuei utilizando ela sem Docker. A versão utilizada foi **1.20.5***
3. Com o Apache Kafka e o microserviço Golang já executando, suba a aplicação NestJS executando um `docker compose up -d` no diretório ***nestjs*** 
4. Por fim, agora podemos subir o frontend NextJS executando um `docker compose up -d` no diretório ***nextjs***

*Obs: As pastas com nome de **.devcontainer** são para a extensão **Dev Containers**, do vscode. Por meio dela, é possível transportar todo o ambiente do container para dentro de uma janela do vscode e ainda adicionar algumas extensões, como se nem estivesse utilizando Docker.*

### Fazendo uma simulação

Para fins de testes e simulações de funcionamento, foi criado um script dentro da aplicação NestJS para simular algumas transações. Para executar o script, é necessário que a aplicação esteja rodando normalmente. Com isso, basta executar um `npm run command simulate-assets-price` em outro terminal.