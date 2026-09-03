#!/bin/sh
set -eu

MAVEN_VERSION="3.9.9"
PROJECT_DIR=$(CDPATH= cd -- "$(dirname -- "$0")" && pwd)
MAVEN_DIR="$PROJECT_DIR/.mvn/apache-maven-$MAVEN_VERSION"
MAVEN_ARCHIVE="$PROJECT_DIR/.mvn/apache-maven-$MAVEN_VERSION-bin.tar.gz"

if [ ! -x "$MAVEN_DIR/bin/mvn" ]; then
  mkdir -p "$PROJECT_DIR/.mvn"
  curl --fail --location --silent --show-error \
    "https://repo.maven.apache.org/maven2/org/apache/maven/apache-maven/$MAVEN_VERSION/apache-maven-$MAVEN_VERSION-bin.tar.gz" \
    --output "$MAVEN_ARCHIVE"
  tar -xzf "$MAVEN_ARCHIVE" -C "$PROJECT_DIR/.mvn"
  rm -f "$MAVEN_ARCHIVE"
fi

exec "$MAVEN_DIR/bin/mvn" "$@"
