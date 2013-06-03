
# Copyright (C) 2013 Google Inc., authors, and contributors <see AUTHORS file>
# Licensed under http://www.apache.org/licenses/LICENSE-2.0 <see LICENSE file>
# Created By:
# Maintained By:

DEBUG = False
TESTING = False
AUTOBUILD_ASSETS = False
ENABLE_JASMINE = False
FULLTEXT_INDEXER = None

# Deployment-specific variables
COMPANY = "Company, Inc."
VERSION = "s3"

# Initialize from environment if present
import os
SQLALCHEMY_DATABASE_URI = os.environ.get('GGRC_DATABASE_URI', '')