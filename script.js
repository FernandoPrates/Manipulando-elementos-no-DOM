// Seleciona o elemento <html> para alterar atributos globais
const html = document.querySelector('html')

// Seleciona os botões dos modos (foco, curto e longo)
const focoBt = document.querySelector('.app__card-button--foco')
const curtoBt = document.querySelector('.app__card-button--curto')
const longoBt = document.querySelector('.app__card-button--longo')

// Seleciona o banner (imagem que muda conforme o contexto)
const banner = document.querySelector('.app__image')

// Seleciona o título principal que muda dependendo do modo
const titulo = document.querySelector('.app__title')

// Seleciona todos os botões que podem ficar ativos
const botoes = document.querySelectorAll('.app__card-button')

// Botão de iniciar/pausar o cronômetro
const startPauseBt = document.querySelector('#start-pause')

// Checkbox que ativa/desativa música de fundo
const musicaFocoInput = document.querySelector('#alternar-musica')

// Texto dentro do botão de iniciar/pausar ("Começar" / "Pausar")
const iniciarOuPausarBt = document.querySelector('#start-pause span')

// Ícone do botão iniciar/pausar
const iniciarOuPausarBtIcone = document.querySelector(".app__card-primary-butto-icon")

// Local onde o tempo é exibido na tela
const tempoNaTela = document.querySelector('#timer')

// Importa os sons utilizados no app
const musica = new Audio('/sons/luna-rise-part-one.mp3')
const audioPlay = new Audio('/sons/play.wav')
const audioPausa = new Audio('/sons/pause.mp3')
const audioTempoFinalizado = new Audio('./sons/beep.mp3')

// Define o tempo inicial em segundos (25 minutos)
let tempoDecorridoEmSegundos = 1500

// Variável que guardará o ID do setInterval
let intervaloId = null

// Faz a música tocar em loop infinito
musica.loop = true

// Liga/desliga a música de fundo
musicaFocoInput.addEventListener('change', () => {
    if(musica.paused) {
        musica.play()
    } else {
        musica.pause()
    }
})

// Botão do modo foco
focoBt.addEventListener('click', () => {
    tempoDecorridoEmSegundos = 1500 // 25 minutos
    alterarContexto('foco')          // Atualiza contexto
    focoBt.classList.add('active')   // Marca botão como ativo
})

// Botão do modo descanso curto
curtoBt.addEventListener('click', () => {
    tempoDecorridoEmSegundos = 300  // 5 minutos
    alterarContexto('descanso-curto')
    curtoBt.classList.add('active')
})

// Botão do modo descanso longo
longoBt.addEventListener('click', () => {
    tempoDecorridoEmSegundos = 900  // 15 minutos
    alterarContexto('descanso-longo')
    longoBt.classList.add('active')
})

// Função que altera a interface conforme o contexto (foco/curto/longo)
function alterarContexto(contexto) {
    mostrarTempo() // Atualiza o tempo na tela

    // Remove classe "active" de todos os botões
    botoes.forEach(function (botao){
        botao.classList.remove('active')
    })

    // Atualiza atributo data-contexto no <html> (para mudar cores via CSS)
    html.setAttribute('data-contexto', contexto)

    // Atualiza imagem do banner
    banner.setAttribute('src', `/imagens/${contexto}.png`)

    // Troca o texto principal conforme o modo
    switch (contexto) {
        case "foco":
            titulo.innerHTML = `
            Otimize sua produtividade,<br>
                <strong class="app__title-strong">mergulhe no que importa.</strong>
            `
            break;

        case "descanso-curto":
            titulo.innerHTML = `
            Que tal dar uma respirada? <strong class="app__title-strong">Faça uma pausa curta!</strong>
            `
            break;

        case "descanso-longo":
            titulo.innerHTML = `
            Hora de voltar à superfície.<strong class="app__title-strong"> Faça uma pausa longa.</strong>
            `
            break;

        default:
            break;
    }
}

// Função executada a cada segundo enquanto o timer está rodando
const contagemRegressiva = () => {
    // Quando o tempo acaba:
    if(tempoDecorridoEmSegundos <= 0){
        audioTempoFinalizado.play() // Toca alerta
        alert('Tempo finalizado!')  // Exibe aviso
        zerar()                     // Reseta botão e intervalo
        return
    }

    // Diminui 1 segundo
    tempoDecorridoEmSegundos -= 1

    // Atualiza tempo no display
    mostrarTempo()
}

// Ativa função de iniciar/pausar ao clicar no botão
startPauseBt.addEventListener('click', iniciarOuPausar)

// Função que inicia ou pausa o cronômetro
function iniciarOuPausar() {
    // Se já existe um intervalo ativo → é pausa
    if(intervaloId){
        audioPausa.play()
        zerar()
        return
    }

    // Se não existe intervalo → iniciar contagem
    audioPlay.play()
    intervaloId = setInterval(contagemRegressiva, 1000)

    iniciarOuPausarBt.textContent = "Pausar" // Texto muda
    iniciarOuPausarBtIcone.setAttribute('src', `/imagens/pause.png`)
}

// Função que pausa e reseta o estado inicial dos botões
function zerar() {
    clearInterval(intervaloId) // Para o timer
    iniciarOuPausarBt.textContent = "Começar"
    iniciarOuPausarBtIcone.setAttribute('src', `/imagens/play_arrow.png`)
    intervaloId = null // Marca como parado
}

// Função para mostrar o tempo no formato mm:ss
function mostrarTempo() {
    const tempo = new Date(tempoDecorridoEmSegundos * 1000)

    // Formata para minutos e segundos
    const tempoFormatado = tempo.toLocaleTimeString('pt-Br', {
        minute: '2-digit',
        second: '2-digit'
    })

    tempoNaTela.innerHTML = `${tempoFormatado}`
}

// Mostra tempo inicial ao carregar a página
mostrarTempo()
