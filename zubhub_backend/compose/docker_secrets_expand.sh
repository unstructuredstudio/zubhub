#!/bin/sh

: ${ENV_SECRETS_DIR:=/run/secrets}

env_secret_debug()
{
    if [ ! -z "$ENV_SECRETS_DEBUG" ]; then
        echo -e "\033[1m$@\033[0m"
    fi
}

set_env_secrets() {
    secret_name=$SECRET_NAME
    secret_file_path="${ENV_SECRETS_DIR}/${secret_name}"
    env_secret_debug "Secret file: $secret_name"
    if [ -f "$secret_file_path" ]; then
        while IFS='' read -r line || [[ -n "$line" ]]; do
            export $line
        done < "$secret_file_path"
    else
        env_secret_debug "Secret file does not exist! $secret"
    fi

    if [ ! -z "$ENV_SECRETS_DEBUG" ]; then
        echo -e "\n\033[1mExpanded environment variables\033[0m"
        printenv
    fi
}

set_env_secrets