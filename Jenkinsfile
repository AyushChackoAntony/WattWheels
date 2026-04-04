pipeline {
    agent any
    
    // Yahan hum naya version automatically generate kar rahe hain build number se
    environment {
        IMAGE_NAME = 'vxpyr/wattwheels-backend'
        IMAGE_TAG = "v1.0.${env.BUILD_ID}" 
        DOCKER_CREDS = 'dockerhub-credentials'
        GITHUB_CREDS = 'github-credentials'
    }
    
    stages {
        stage('Build Docker Image') {
            steps {
                dir('backend') { 
                    bat "docker build -t %IMAGE_NAME%:%IMAGE_TAG% ."
                }
            }
        }
        
        stage('Push to Docker Hub') {
            steps {
                withCredentials([usernamePassword(credentialsId: env.DOCKER_CREDS, passwordVariable: 'DOCKER_PASS', usernameVariable: 'DOCKER_USER')]) {
                    bat "docker login -u %DOCKER_USER% -p %DOCKER_PASS%"
                    bat "docker push %IMAGE_NAME%:%IMAGE_TAG%"
                }
            }
        }
        
        stage('Update K8s Manifest & GitOps Push') {
            steps {
                // YAML file ko naye version se update karna aur GitHub pe bhejna
                withCredentials([usernamePassword(credentialsId: env.GITHUB_CREDS, passwordVariable: 'GIT_PASS', usernameVariable: 'GIT_USER')]) {
                    
                    powershell """
                        (Get-Content k8s/backend/backend-deployment.yaml) -replace 'image: AyushChackoAntony/wattwheels-backend:.*', 'image: vxpyr/wattwheels-backend:${IMAGE_TAG}' | Set-Content k8s/backend/backend-deployment.yaml
                    """
                    
                    bat """
                        git config user.email "jenkins@automation.com"
                        git config user.name "Jenkins Auto Deploy"
                        git add k8s/backend/backend-deployment.yaml
                        git commit -m "ArgoCD Update: Backend image changed to %IMAGE_TAG% [skip ci]"
                        git push https://%GIT_USER%:%GIT_PASS%@github.com/AyushChackoAntony/WattWheels.git HEAD:test
                    """
                }
            }
        }
    }
}