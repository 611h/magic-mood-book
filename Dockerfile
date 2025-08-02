FROM rockylinux:9

ENV HOME="/root"
ENV NVM_DIR="$HOME/.nvm"
ENV APP="$HOME/app"
ENV PORT=3000

WORKDIR $APP

# Install git
RUN yum install -y git

# Clone the repository
RUN git clone https://github.com/611h/magic-mood-book.git .

# Install Ollama
RUN curl -fsSL https://ollama.com/install.sh | sh &&\
    { nohup ollama serve &> /dev/null & } &&\
    (while ! curl -s http://localhost:11434/health; do sleep 1; done) &&\
    ollama pull gemma3:1b &&\
    ollama run gemma3:1b

# Install Node
RUN curl -sL https://rpm.nodesource.com/setup_lts.x | bash - &&\
    yum install -y nodejs && npm install

ENTRYPOINT [ "sh", "./entrypoint.sh" ]

EXPOSE $PORT
