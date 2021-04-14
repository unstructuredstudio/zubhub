class SaferProxyFix(object):
    """This middleware can be applied to add HTTP proxy support to an
    application that was not designed with HTTP proxies in mind.  It
    sets `REMOTE_ADDR`, `HTTP_HOST` from `X-Forwarded` headers.

    If you have more than one proxy server in front of your app, set
    num_proxy_servers accordingly
    Do not use this middleware in non-proxy setups for security reasons.

    get_remote_addr will raise an exception if it sees a request that 
    does not seem to have enough proxy servers behind it so long as
    detect_misconfiguration is True.
    The original values of `REMOTE_ADDR` and `HTTP_HOST` are stored in
    the WSGI environment as `werkzeug.proxy_fix.orig_remote_addr` and
    `werkzeug.proxy_fix.orig_http_host`.
    :param app: the WSGI application
    """

    def __init__(self, app, num_proxy_servers=1, detect_misconfiguration=False):
        self.app = app
        self.num_proxy_servers = num_proxy_servers
        self.detect_misconfiguration = detect_misconfiguration

    def get_remote_addr(self, forwarded_for):
        """Selects the new remote addr from the given list of ips in
        X-Forwarded-For.  By default the last one is picked. Specify
        num_proxy_servers=2 to pick the second to last one, and so on.
        """
        if self.detect_misconfiguration and not forwarded_for:
            raise Exception(
                "SaferProxyFix did not detect a proxy server. Do not use this fixer if you are not behind a proxy.")
        if self.detect_misconfiguration and len(forwarded_for) < self.num_proxy_servers:
            raise Exception(
                "SaferProxyFix did not detect enough proxy servers. Check your num_proxy_servers setting.")

        if forwarded_for and len(forwarded_for) >= self.num_proxy_servers:
            return forwarded_for[-1 * self.num_proxy_servers]

    def __call__(self, environ, start_response):
        if self.num_proxy_servers == 0:
            return self.app(environ, start_response)
        getter = environ.get
        forwarded_proto = getter('HTTP_X_FORWARDED_PROTO', '')
        forwarded_for = getter('HTTP_X_FORWARDED_FOR', '').split(',')
        forwarded_host = getter('HTTP_X_FORWARDED_HOST', '')
        environ.update({
            'werkzeug.proxy_fix.orig_wsgi_url_scheme':  getter('wsgi.url_scheme'),
            'werkzeug.proxy_fix.orig_remote_addr':      getter('REMOTE_ADDR'),
            'werkzeug.proxy_fix.orig_http_host':        getter('HTTP_HOST')
        })
        forwarded_for = [x for x in [x.strip() for x in forwarded_for] if x]
        remote_addr = self.get_remote_addr(forwarded_for)
        if remote_addr is not None:
            environ['REMOTE_ADDR'] = remote_addr
        if forwarded_host:
            environ['HTTP_HOST'] = forwarded_host
        if forwarded_proto:
            environ['wsgi.url_scheme'] = forwarded_proto
        return self.app(environ, start_response)
