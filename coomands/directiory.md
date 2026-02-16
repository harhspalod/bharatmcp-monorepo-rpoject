# Run this in the folder where you want the project created

mkdir -p bharatmcp/backend/app/{db,models,services,routes,middleware} bharatmcp/{widget,dashboard}

# Root files
touch bharatmcp/README.md bharatmcp/PRODUCT.md

# Backend files
touch bharatmcp/backend/requirements.txt
touch bharatmcp/backend/.env.example
touch bharatmcp/backend/.env

# App files
touch bharatmcp/backend/app/__init__.py
touch bharatmcp/backend/app/config.py
touch bharatmcp/backend/app/main.py

# DB
touch bharatmcp/backend/app/db/__init__.py
touch bharatmcp/backend/app/db/mongodb.py

# Models
touch bharatmcp/backend/app/models/__init__.py
touch bharatmcp/backend/app/models/user.py
touch bharatmcp/backend/app/models/site.py
touch bharatmcp/backend/app/models/tool.py
touch bharatmcp/backend/app/models/api_key.py
touch bharatmcp/backend/app/models/chat.py

# Services
touch bharatmcp/backend/app/services/__init__.py
touch bharatmcp/backend/app/services/auth.py
touch bharatmcp/backend/app/services/gemini.py
touch bharatmcp/backend/app/services/tool_executor.py
touch bharatmcp/backend/app/services/chat.py

# Routes
touch bharatmcp/backend/app/routes/__init__.py
touch bharatmcp/backend/app/routes/auth.py
touch bharatmcp/backend/app/routes/sites.py
touch bharatmcp/backend/app/routes/tools.py
touch bharatmcp/backend/app/routes/api_keys.py
touch bharatmcp/backend/app/routes/chat.py

# Middleware
touch bharatmcp/backend/app/middleware/__init__.py
touch bharatmcp/backend/app/middleware/auth.py
