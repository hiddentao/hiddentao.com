---
title: Django - fetching list of all SQL queries executed so far for all requests
date: '2011-12-18'
summary: "As part of a recent Django project I had to provide a way to view all the SQL queries which had been executed through the Django app across all requests, when using the Django test server. Although the debug toolbar that ships with Django shows such query information it doesn't work for queries executed as a part of AJAX requests. \r\n"
tags:
  - AJAX
  - Python
  - Django
  - Profiling
---
As part of a recent Django project I had to provide a way to view all the SQL queries which had been executed through the Django app across all requests, when using the Django test server. Although the debug toolbar that ships with Django shows such query information it doesn't work for queries executed as a part of AJAX requests.

Although the Django test server is single-threaded (and thus all requests execute in the same thread) it does not maintain a global application state which is accessible to each request, as far as I'm aware. However, because it is single-threaded we can simulate a globally accessible application state through the use of static class member variables.

My snippet below does just this. It uses request-response middleware which kicks in during the response phase to add all SQL queries executed as part of the current request to a static class member list variable. Accessing the data requires calling a separate URL (`/profiling`) which will then output all the SQL queries so far 'collected'.

Further improvements to this may include establishing a persistent socket connection to the server through which SQL query strings are received as and when they get executed. And instead of displaying the list of queries on their own page we could inject them into the Debug toolbar, if it's enabled. In fact, enhancing the Debug toolbar itself to pick up queries executed as part of AJAX requests would be the best implementation yet.

The snippet (see [http://djangosnippets.org/snippets/2632/](http://djangosnippets.org/snippets/2632/)):

```python
# file: settings.py
 
MIDDLEWARE_CLASSES = (
    'django.middleware.common.CommonMiddleware',
    'yourapp.middleware.SqlProfilingMiddleware',
    ...
)
 
 
# file: yourapp/middleware.py
 
from django.db import connection
import time
 
class SqlProfilingMiddleware(object):
    Queries = []
 
    def process_request(self, request):
        return None
    def process_view(self, request, view_func, view_args, view_kwargs):
        return None
    def process_template_response(self, request, response):
        self._add_sql_queries(request)
        return response
    def process_response(self, request, response):
        self._add_sql_queries(request)
        return response
    def process_exception(self, request, exception):
        return None
 
    def _add_sql_queries(self, request):
        for q in connection.queries:
            q["time"] = time.time() + float(q["time"])
            SqlProfilingMiddleware.Queries.insert(0, q)
            # add request info as a separator
        SqlProfilingMiddleware.Queries.insert(0, {"time": time.time(), "path" : request.path})
 
 
# file: yourapp/views.py
 
from yourapp.middleware import SqlProfilingMiddleware
 
def profiling(request):
    return render_to_response("profiling.html", {"queries": SqlProfilingMiddleware.Queries})
 
 
# file: urls.py
 
urlpatterns = patterns('',
  (r'^profiling/$', 'yourapp.views.profiling'),
)
```
