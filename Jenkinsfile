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

                    ssh ${REMOTE_USER}@${REMOTE_HOST} "mkdir -p ${REMOTE_PATH}"

                    # Copy files to the remote server
                    scp -r * ${REMOTE_USER}@${REMOTE_HOST}:${REMOTE_PATH}

                    # SSH into the remote server and restart the application
                     ssh admin@daas-aws << EOF
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
