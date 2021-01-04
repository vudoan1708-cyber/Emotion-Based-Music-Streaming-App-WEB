# encoding: utf-8

"""
Copyright Refinery29, Inc.

Permission is hereby granted, free of charge, to any person obtaining a
copy of this software and associated documentation files (the
"Software"), to deal in the Software without restriction, including
without limitation the rights to use, copy, modify, merge, publish,
distribute, sublicense, and/or sell copies of the Software, and to permit
persons to whom the Software is furnished to do so, subject to the
following conditions:

The above copyright notice and this permission notice shall be included
in all copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS
OR IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF
MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN
NO EVENT SHALL THE AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM,
DAMAGES OR OTHER LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR
OTHERWISE, ARISING FROM, OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE
USE OR OTHER DEALINGS IN THE SOFTWARE.


Port of NodeJS's querystring module.

Contains methods to parse and format query strings, as well as encode and
decode URI strings.

The code was adapted from:

https://github.com/joyent/node/blob/master/lib/querystring.js

Documentation has also been adapted from:

https://nodejs.org/api/querystring.html
"""

import math
import re
import urllib


def encode_uri_component(uri_component):
    """Python equivalent of Javascript's encodeURIComponent()"""
    return urllib.quote(
            unicode(uri_component).encode('utf-8'),
            safe='~()*!.\'')


def decode_uri_component(uri_component):
    """Python equivalent of Javascript's decodeURIComponent()"""
    return urllib.unquote(uri_component).decode('utf-8')


def stringify_obj(obj, sep='&', eq='=', encode_fn=None):
    """
    Serialize an object to a query string. Optionally override the default
    separator ('&') and assignment ('=') characters.

    encode_fn (encode_uri_component by default) can be used to encode string
    with non-utf8 encoding if necessary.

    Example: ::

        querystring.stringify_obj(
            {'foo': 'bar', 'baz': ['qux', 'quux'], corge: ''})
        # returns
        'foo=bar&baz=qux&baz=quux&corge='

        querystring.stringify_obj(
            {'foo': 'bar', 'baz': 'qux'}, sep=';', eq=':')
        # returns
        'foo:bar;baz:qux'

        gbk_encode = lambda s: urllib.quote(unicode(s).encode('gbk'))
        querystring.stringify_obj(
            {'w': '中文', 'foo': 'bar'}, encode_fn=gbk_encode)
        # returns
        'w=%D6%D0%CE%C4&foo=bar'
    """
    def stringify_primitive(v):
        if isinstance(v, basestring):
            return v

        if isinstance(v, bool):
            if v:
                return 'true'
            return 'false'

        if isinstance(v, (int, float, long)):
            if math.isinf(v) or math.isnan(v):
                return ''
            return str(v)

        return ''

    if encode_fn is None or not hasattr(encode_fn, '__call__'):
        encode_fn = encode_uri_component

    if isinstance(obj, dict):
        fields = []

        for k, v in obj.iteritems():
            ks = encode_fn(stringify_primitive(k)) + eq

            if hasattr(v, '__iter__'):
                fields.extend(
                    [(ks + encode_fn(stringify_primitive(vv))) for vv in v])
            else:
                fields.append(ks + encode_fn(stringify_primitive(v)))

        return sep.join(fields)

    return ''


def parse_qs(qs, sep='&', eq='=', max_keys=1000, decode_fn=None):
    """
    Deserialize a query string to an object. Optionally override the default
    separator ('&') and assignment ('=') characters.

    max_keys (equal to 1000 by default) can be used to limit processed keys.
    Set it to 0 to remove key count limitation.

    decode_fn (decode_uri_component by default) can be used to decode
    non-utf8 encoding string if necessary.

    Example: ::

        querystring.parse_qs('foo=bar&baz=qux&baz=quux&corge')
        # returns
        {u'foo': u'bar', u'baz': [u'qux', u'quux'], u'corge': u''}

        # Suppose gbk_decode function already exists,
        # it can decode `gbk` encoding string
        querystring.parse('w=%D6%D0%CE%C4&foo=bar', decode_fn=gbk_decode)
        # returns
        {'w': '中文', 'foo': 'bar'}
    """
    if decode_fn is None or not hasattr(decode_fn, '__call__'):
        decode_fn = decode_uri_component

    obj = {}

    if isinstance(qs, str) and len(qs) == 0:
        return obj

    regexp = '+'
    qs = qs.split(sep)

    qs_len = len(qs)
    if max_keys > 0 and qs_len > max_keys:
        qs_len = max_keys

    for i in range(qs_len):
        x = qs[i].replace(regexp, '%20')
        idx = x.find(eq)
        kstr = None
        vstr = None
        k = None
        v = None

        if idx >= 0:
            kstr = x[0:idx]
            vstr = x[idx + 1:]
        else:
            kstr = x
            vstr = ''

        k = decode_fn(kstr)
        v = decode_fn(vstr)

        if k not in obj:
            obj[k] = v
        elif hasattr(obj[k], '__iter__'):
            obj[k].append(v)
        else:
            obj[k] = [obj[k], v]

    return obj
