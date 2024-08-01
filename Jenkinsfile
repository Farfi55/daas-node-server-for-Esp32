pipeline {
    agent any

    environment {
        // Define any environment variables, such as PATHs or secrets
        NODE_VERSION = '22.x'
    }

    stages {
        stage('Clone repository') {
            steps {
                // Clone the repository
                git branch: 'master', url: 'https://github.com/Farfi55/daas-node-server-for-Esp32.git'
            }
        }

        stage('Install Dependencies') {
            steps {
                // Install Node.js and dependencies
                sh 'npm install'
            }
        }

        stage('Run Tests') {
            steps {
                // Run tests
                sh 'npm test'
            }
        }

        // right now, no build step is needed
        // stage('Build') {
        //     steps {
                
        //     }
        // }

        stage('Deploy') {
            steps {
                // Deploy the application
                // Replace 'aws-ssh-credentials' with the ID of your SSH credentials in Jenkins
                sshagent(['farfi-ssh']) {
                    sh """
                    # Define the remote host and path variables
                    REMOTE_USER=admin
                    REMOTE_HOST=daas-aws
                    REMOTE_PATH=/home/admin/daas-node-server

                    # SSH into the remote server, clone the repository, and update it
                    ssh "admin@daas-aws" << EOF
                      . ~/.profile

                      if [ ! -d "/home/admin/daas-node-server" ]; then
                        git clone https://github.com/Farfi55/daas-node-server-for-Esp32.git /home/admin/daas-node-server
                      else
                        cd /home/admin/daas-node-server
                        git stash push -m "Backup before deployment"
                        git pull
                      fi

                      cd /home/admin/daas-node-server
                      npm install --production
                      pm2 reload index.js
                    EOF
                    """
                }
            }
        }
    }
}
