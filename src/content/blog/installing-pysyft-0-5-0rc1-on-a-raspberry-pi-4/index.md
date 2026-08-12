---
title: "Installing PySyft v0.5.0 with PyGrid on a Raspberry Pi 4"
slug: installing-pysyft-0-5-0rc1-on-a-raspberry-pi-4
date: 2021-04-19T14:21:10
updated: 2024-12-19T19:22:24
categories: [product]
tags: [federated-learning, pysyft, tutorials]
authors: [rene-schwermer]
cover: ./cover.jpg
coverAlt: ""
cardText: light
draft: false
legacyId: 1762
---

1.  [Introduction](#introduction)
2.  [Install PySyft](#install-pysyft)
    1.  [PyTorch v1.8.1 (1 min)](#install-pytorch-v1.8.1-\(1-min\))
    2.  [Install other dependencies (6 min)](#install-other-dependencies-\(6-min\))
    3.  [Install syft 0.5.0 (6 min)](#install-syft-0.5.0-\(6-min\))
3.  [Testing the environment](#testing-the-environment)
4.  [Installing PyGrid dependencies](#installing-pygrid-dependencies)
5.  [Dockerfile](#dockerfile)

## Introduction

The PySyft framework enables practitioners and stakeholders in the AI domain to leverage the potential of Federated Learning. This method is part of privacy preserving machine learning and allows data scientists to work with remote data, without revealing it. This approach is especially interesting in the context of high demand for big data to train AI models on the one side and data privacy regulations on the other side. Some examples of such regulations are the General Data Protection Regulation in the European Union \[1\], the California Consumer Privacy Act in the USA \[2\] or the Personal Data Protection (Amendment) Act in Singapore \[3\].

Federated Learning systems can either be tested with virtual nodes on the same machine or with physically separated nodes. Running experiments with the data scientist and data owner being on separate devices is important to account for possible hardware constraints. A Raspberry Pi can be a good choice for simulating the data owner’s device. It is a Single-Board-Computer (SBC), which can handle data acquisition and control, data processing and storage, connectivity and power management. The CPU architecture is ARM based and some Python packages are not instantly available over  pip install <package\_name> for example. This is especially the case for older PySyft versions like v0.2.9 and v0.3.0. To reduce complexity, we focus therefore on the latest version of syft, at the time of writing this post. At the end you’ll find a dockerfile capturing all mentioned steps. The image is also hosted on Docker Hub with the image name rene36/pysyft050rc1.

## Install PySyft

This is an updated version of the previous installation guide for PySyft v0.5.0rc.

The numbers you will see in brackets give the execution time of a specific command. They should help giving an order of magnitude about the required installation time for syft. Our setup for installing PySyft v0.5.0 is as follows:

-   Raspberry Pi 4B with 8 GB of memory
-   32 GB SSD card (erased)
-   Image (Ubuntu Server 20.04 LTS 64bit) flashed with Raspberry Pi Imager v1.3.
-   Using a fresh Ubuntu 20.04 LTS 64bit installation.
-   Connecting to the Raspberry Pi via SSH, which is connected with a LAN.

Some characteristics of the system are:

| Command | Output |
| --- | --- |
| lsb\_release -a | Distributor ID: Ubuntu Description: Ubuntu 20.10 Release: 20.10 Codename: groovy |
| uname -a | Linux raspi28 5.8.0-1015-raspi #18-Ubuntu SMP PREEMPT Fri Feb 5 06:09:58 UTC 2021 aarch64 aarch64 aarch64 GNU/Linux |
| gcc –version | gcc (Ubuntu 10.2.0-13ubuntu1) 10.2.0 |
| python –version | Python 3.8.5 |

### PyTorch v1.8.1 (1 min)

Based on the GitHub repository of PySyft the latest supported torch version is 1.8.1. Note that numpy is already pre-installed on the system. If this is not the case, the installation can take much longer.

```python
pip3 install torch==1.8.1
# Successfully installed numpy-1.21.0 torch-1.8.1
```

### Install other dependencies (6 min)

The Python package orchcsprng generates a random 128-bit key on CPU using one of its generators and runs AES128 in CTR mode either on CPU or on GPU using CUDA to generate a random 128 bit state and apply a transformation function to map it to target tensor values. See their [GitHub repository](https://github.com/pytorch/csprng) for more information.

The Python package av requires some dependencies for FFmpeg. After that we install the [av](https://pypi.org/project/av/), toml and [sycret](https://github.com/OpenMined/sycret) Python packages.

```python
# Python package csprng v0.2.1
# ------------------------------------------
cd ~ && git clone https://github.com/pytorch/csprng.git--branch=v0.2.1
cd csprng
python setup.py install or pip install . 
# Finished processing dependencies for torchcsprng==0.2.0a0+ab7d33e

# Python package av
# ------------------------------------------
sudo apt install -y libavdevice-dev
pip install av>=8.0.0
# Successfully installed av-8.0.3

# Install aiortc dependencies
# ------------------------------------------
sudo apt install libavfilter-dev libopus-dev libvpx-dev pkg-config

# Python package toml
# ------------------------------------------
pip install toml
# Successfully installed toml-0.10.2

# Python package sycret
# ------------------------------------------
sudo apt install -y rustc
cd ~ && git clone https://github.com/OpenMined/sycret.git && cd sycret
python setup.py install or pip install . 
# Successfully installed cffi-1.15.0 pycparser-2.21 sycret-0.2.8
```

### Install syft 0.5.0 (6 min)

Now we are ready to install syft version 0.5.0 with

```python
pip install syft==0.5.0  # (6 min)
# Successfully installed (output formated for an easier overview)
# Jinja2-2.11.3 	MarkupSafe-2.0.1 
# PyJWT-1.7.1 		PyNaCl-1.4.0 
# PyYAML-5.4.1 		Werkzeug-1.0.1 
# aiortc-1.2.0 		cachetools-4.2.2 
# certifi-2021.5.30 	cffi-1.14.5 
# chardet-4.0.0 	click-7.1.2 
# crc32c-2.2.post0 	cryptography-3.4.7 
# dpcontracts-0.6.0 	flask-1.1.4 
# forbiddenfruit-0.1.4 	idna-2.10 
# itsdangerous-1.1.0 	joblib-1.0.1 
# loguru-0.5.3 		names-0.3.0 
# nest-asyncio-1.5.1 	packaging-21.0 
# pandas-1.3.0 		pillow-8.3.0 
# protobuf-3.17.3 	pyarrow-4.0.1 
# pycparser-2.20 	pyee-8.1.0 
# pylibsrtp-0.6.8 	pyparsing-2.4.7 
# python-dateutil-2.8.1 pytz-2021.1 
# requests-2.25.1 	requests-toolbelt-0.9.1 
# scikit-learn-0.24.2 	scipy-1.7.0 
# six-1.16.0 		sqlitedict-1.7.0 
# syft-0.5.0 		syft-proto-0.5.3 
# threadpoolctl-2.1.0 	torchvision-0.9.1 
# urllib3-1.26.6 	websocket-client-1.1.0 
# wrapt-1.12.1
```

## Testing the environment

Let’s check if the installation worked as expected. Open Python in a console, import the three major packages and check the exact version of them.

```python
python3
import syft
import torch
import torchvision

# Check package versions
print(syft.__version__)  # two under scores
print(torch.__version__)
print(torchvision.__version__)
```

## Installing PyGrid dependencies

Except of the Python package TenSEAL all dependencies can be installed with pip. The whole installation takes around 40 minutes.

```python
git clone https://github.com/OpenMined/PySyft.git --branch=0.5.0
cd PySyft/packages/grid/apps/domain

pip install poetry
poetry install

pip install Flask-Cors gevent-websocket Flask-Sockets Flask-Migrate sqlalchemy-mixins flask-executor bcrypt python-dp terrascript 

# Successfully installed (output formated for an easier overview)
# Flask-Cors-3.0.10 		Flask-Migrate-3.0.1 
# Flask-SQLAlchemy-2.5.1 	Flask-Sockets-0.2.1 
# Mako-1.1.4 			PyInquirer-1.0.3 
# Pygments-2.9.0		SQLAlchemy-1.4.20 
# SecretStorage-3.3.1		alembic-1.6.5 
# appdirs-1.4.4			bcrypt-3.2.0 
# boto3-1.17.105 		botocore-1.20.105 
# cachecontrol-0.12.6 		cachy-0.3.0 cleo-0.8.1 
# clikit-0.6.2 			crashtest-0.3.1 
# distlib-0.3.2 		filelock-3.0.12 
# flask-executor-0.9.4 		gevent-21.1.2 
# gevent-websocket-0.10.1 	greenlet-1.1.0 
# html5lib-1.1 			jeepney-0.6.0 
# jmespath-0.10.0 		keyring-21.8.0 
# lockfile-0.12.2 		msgpack-1.0.2 
# packaging-20.9 		pastel-0.2.1 
# pexpect-4.8.0 		pkginfo-1.7.0 
# poetry-1.1.7 			poetry-core-1.0.3 
# prompt-toolkit-1.0.14 	ptyprocess-0.7.0 
# pygrid-cli-0.5.0 		pylev-1.4.0 
# python-dp-0.1.0 		python-editor-1.0.4 
# regex-2021.7.6 		s3transfer-0.4.2 
# shellingham-1.4.0 		sqlalchemy-mixins-1.4 
# sympc-0.5.0rc1.post0.dev82+gd6411e2 	terrascript-0.9.0 
# tomlkit-0.7.2 		virtualenv-20.4.7 
# wcwidth-0.2.5 		webencodings-0.5.1 
# zope.event-4.5.0 		zope.interface-5.4.0

cd PySyft/packages/grid/apps/domain
nano run.sh

# Add the environment variables at the beginning of run.sh
export APP_ENV=dev
export APP_SRC=/home/ubuntu/pysyft50/packages/grid/apps/domain  # Check your path via pwd
export LOCAL_DATABASE=True
export PORT=5000

./run.sh
```

We build TenSEAL from source.

```python
cd ~ && git clone https://github.com/OpenMined/TenSEAL.git && cd TenSEAL pip install cmake && python setup.py install  # (32 min)
```

## Dockerfile

Adjust the below Dockerfile. Feel free to use the below dockerfile as a starting point.

```python
FROM ubuntu:20.04

RUN apt-get update && 
    apt-get upgrade --yes

ENV DEBIAN_FRONTEND=noninteractive 
RUN apt-get install --yes software-properties-common python3 python3-pip && 
    apt-get install --yes git && 
    apt-get install --yes libavdevice-dev libavfilter-dev libopus-dev libvpx-dev pkg-config ffmpeg && 
    apt-get install --yes libvpx-dev libopus-dev libffi-dev

# Install torch
RUN pip3 install torch==1.8.0

# Build torchvision from source
RUN git clone https://github.com/pytorch/vision.git --branch=v0.9.0
WORKDIR /vision
RUN python3 setup.py install

# Build aiortc from source
WORKDIR /
RUN git clone https://github.com/aiortc/aiortc.git
WORKDIR /aiortc
RUN python3 setup.py install

# Install syft
RUN pip3 install syft==0.5.0rc1

CMD ["/bin/sh"]
```

## References

\[1\] European Union, REGULATION (EU) 2016/679 OF THE EUROPEAN PARLIAMENT AND OF THE COUNCIL of 27 April 2016 on the protection of natural persons with regard to the processing of personal data and on the free movement of such data, and repealing Directive 95/46/EC (General Data Protection Regulation), 2016

\[2\] State of California Department of Justice , California Consumer Privacy Act of 2018 \[1798.100 – 1798.199.100\], 2018

\[3\] Personal Data Protection Commission Singapore, Personal Data Protection Act, 2014
