# #!/bin/bash

# # 의존성 설치 #
# npm install

# # PM2로 앱 관리 ###
# # 이미 실행 중인 앱이 있으면 삭제
# pm2 delete 2mergency-project || true

# # 앱을 PM2로 다시 등록 및 시작
# pm2 start npm --name "2mergency-project" -- run start

# # PM2 설정 저장 (서버 재시작시 앱 자동 시작을 위함) ###
# pm2 save

#!/bin/bash

cd /home/ubuntu/2mergency-project
touch debug_git_action_log.log

echo "" >> debug_git_action_log.log
date +%Y-%m-%d_%T >> debug_git_action_log.log
echo "***** Start npm install *****" >> debug_git_action_log.log

# 의존성 설치 #
npm install

echo "***** pm2 delete 2mergency-project *****" >> debug_git_action_log.log

# PM2로 앱 관리 ###
# 이미 실행 중인 앱이 있으면 삭제
pm2 delete 2mergency-project || true

echo "***** pm2 start *****" >> debug_git_action_log.log

# 앱을 PM2로 다시 등록 및 시작
pm2 start npm --name "2mergency-project" -- run start

echo "***** pm2 end *****" >> debug_git_action_log.log

# PM2 설정 저장 (서버 재시작시 앱 자동 시작을 위함) ###
pm2 save

echo "***** pm2 save *****" >> debug_git_action_log.log