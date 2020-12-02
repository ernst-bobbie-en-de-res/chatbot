# set base image (host OS)
FROM python:3.8 as builder

# set the working directory in the container
WORKDIR /code

# copy the dependencies file to the working directory
COPY requirements.txt .

# install dependencies
RUN pip install -r requirements.txt

# copy the content of the local src directory to the working directory
COPY  . .

RUN python ./scripts/install-punkt.py

FROM python:3.8 

WORKDIR /code/

COPY --from=builder /code .

RUN pip install -r requirements.txt

# command to run on container start
CMD [ "python", "./src/api.py" ]
