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
"""

import urllib

import nose.tools as nt

import querystring


class TestQueryString(object):
    def __init__(self):
        self.qs = 'foo=bar&baz=qux&baz=quux&corge='
        self.parsed_qs = {'foo': 'bar', 'baz': ['qux', 'quux'], 'corge': ''}

        self.gbk_qs = 'foo=bar&w=%D6%D0%CE%C4'
        self.parsed_gbk_qs = {'foo': 'bar', 'w': u'中文'}

        self.gbk_encode = lambda s: urllib.quote(unicode(s).encode('gbk'))
        self.gbk_decode = lambda s: urllib.unquote(s)

    def test_parse_qs(self):
        parsed_qs = querystring.parse_qs(self.qs)

        nt.assert_equals(parsed_qs, self.parsed_qs)

    def test_parse_qs_honors_sep_and_eq(self):
        qs = self.qs.replace('&', ';').replace('=', ':')
        parsed_qs = querystring.parse_qs(qs, sep=';', eq=':')

        nt.assert_equals(parsed_qs, self.parsed_qs)

    def test_parse_qs_honors_custom_decode_fn(self):
        self.parsed_gbk_qs['w'] = self.parsed_gbk_qs['w'].encode('gbk')
        parsed_qs = querystring.parse_qs(self.gbk_qs,
                                         decode_fn=self.gbk_decode)

        nt.assert_equals(parsed_qs, self.parsed_gbk_qs)

    def test_stringify_obj(self):
        qs = querystring.stringify_obj(self.parsed_qs)

        nt.assert_equals(qs, self.qs)

    def test_stringify_obj_honors_sep_and_eq(self):
        expected_qs = self.qs.replace('&', ';').replace('=', ':')
        qs = querystring.stringify_obj(self.parsed_qs, sep=';', eq=':')

        nt.assert_equals(qs, expected_qs)

    def test_stringify_obj_honors_custom_encode_fn(self):
        qs = querystring.stringify_obj(self.parsed_gbk_qs,
                                       encode_fn=self.gbk_encode)

        nt.assert_equals(qs, self.gbk_qs)
