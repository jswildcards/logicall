FROM nginx:1.19.2

RUN mkdir /etc/nginx/sites-available && rm /etc/nginx/conf.d/default.conf
ADD nginx.conf /etc/nginx/
COPY sites /etc/nginx/sites-available

CMD nginx
