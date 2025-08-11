FROM python:3.12

# set work directory
WORKDIR /app

# install dependencies
COPY requirements.txt .
RUN pip install --no-cache-dir -r requirements.txt

# copy project files
COPY . .

# run as non-root for safety
RUN adduser --disabled-password django
USER django
