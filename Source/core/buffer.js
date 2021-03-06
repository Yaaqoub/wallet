/*
 * @project: TERA
 * @version: Development (beta)
 * @copyright: Yuriy Ivanov 2017-2019 [progr76@gmail.com]
 * @license: MIT (not for evil)
 * Web: http://terafoundation.org
 * GitHub: https://github.com/terafoundation/wallet
 * Twitter: https://twitter.com/terafoundation
 * Telegram: https://web.telegram.org/#/im?p=@terafoundation
*/


function Write(e,r,t,n,l)
{
    if("number" == typeof t)
        throw ToLogTrace("ERRR StringFormat "), "ERR!!";
    var a = t;
    if("buffer" === a.substr(0, 6) && 6 < a.length)
        n = parseInt(a.substr(6)), a = "buffer";
    else
        if("arr" === a.substr(0, 3) && 3 < a.length)
            n = parseInt(a.substr(3)), a = "arr";
        else
            if("str" === a.substr(0, 3) && 3 < a.length)
            {
                var f = parseInt(a.substr(3));
                return r && e.write(r, e.len, f), void (e.len += f);
            }
    switch(a)
    {
        case "str":
            var i = toUTF8Array(r);
            65535 < (f = i.length) && (f = 0), e[e.len] = 255 & f, e[e.len + 1] = f >>> 8 & 255, e.len += 2;
            for(var s = 0; s < f; s++)
                e[e.len + s] = i[s];
            e.len += f;
            break;
        case "byte":
            r < 0 && (r = 0), e[e.len] = r, e.len += 1;
            break;
        case "double":
            e.writeDoubleLE(r, e.len, 8), e.len += 8;
            break;
        case "uint":
            r < 0 && (r = 0), 0xffffffffffff <= r && (r = 0), e.writeUIntLE(r, e.len, 6), e.len += 6;
            break;
        case "uint16":
            r < 0 && (r = 0), e[e.len] = 255 & r, e[e.len + 1] = r >>> 8 & 255, e.len += 2;
            break;
        case "uint32":
            r < 0 && (r = 0), e.writeUInt32LE(r, e.len, 4), e.len += 4;
            break;
        case "time":
            var u = r.valueOf();
            e.writeUIntLE(u, e.len, 6), e.len += 6;
            break;
        case "addres":
        case "hash":
            f = r ? Math.min(32, r.length) : 0;
            for(s = 0; s < f; s++)
                e[e.len + s] = r[s];
            e.len += 32;
            break;
        case "buffer":
            f = void 0 === n ? r.length : Math.min(n, r.length);
            for(s = 0; s < f; s++)
                e[e.len + s] = r[s];
            e.len += n;
            break;
        case "arr":
            f = r ? Math.min(n, r.length) : 0;
            for(s = 0; s < f; s++)
                e[e.len + s] = r[s];
            e.len += n;
            break;
        case "tr":
            f = r.length;
            MAX_TRANSACTION_SIZE > MAX_TRANSACTION_SIZE && (f = MAX_TRANSACTION_SIZE), e[e.len] = 255 & f, e[e.len + 1] = f >>> 8 & 255,
            e.len += 2;
            for(s = 0; s < f; s++)
                e[e.len + s] = r[s];
            e.len += f;
            break;
        case "data":
            f = r.length;
            e.writeUInt32LE(f, e.len, 4), e.len += 4;
            for(s = 0; s < f; s++)
                e[e.len + s] = r[s];
            e.len += f;
            break;
        case "hashSTR":
            var o = GetHexFromAddres(r);
            e.write(o, e.len, 64), e.len += 64;
            break;
        case "uintSTR":
            o = r.toString();
            e.write(o, e.len, 10), e.len += 10;
            break;
        default:
            l = l || {};
            var b = t.substr(0, 1);
            if("[" === b)
            {
                r && (f = r.length);
                var d = GetMiddleString(a);
                Write(e, f, "uint32");
                for(s = 0; s < f; s++)
                    Write(e, r[s], d, void 0, l);
            }
            else
            {
                if("{" !== b)
                    throw "Bad write type params: " + a;
                var c = l[a];
                c || (c = GetAttributes(GetMiddleString(a)), l[a] = c);
                for(s = 0; s < c.length; s++)
                {
                    var h = c[s];
                    Write(e, r[h.Key], h.Value, void 0, l);
                }
            }
    }
};

function Read(e,r,t,n,l)
{
    var a;
    if("number" == typeof r)
        throw ToLogTrace("ERR StringFormat"), "ERRR!";
    var f = r;
    if("buffer" === f.substr(0, 6))
        6 < f.length ? (t = parseInt(f.substr(6)), f = "buffer") : t = 0;
    else
        if("arr" === f.substr(0, 3))
            3 < f.length ? (t = parseInt(f.substr(3)), f = "arr") : t = 0;
        else
            if("str" === f.substr(0, 3))
            {
                if(3 < f.length)
                {
                    var i = parseInt(f.substr(3));
                    a = e.toString("utf8", e.len, e.len + i), e.len += i;
                    for(var s =  - 1, u = a.length - 1; 0 <= u; u--)
                        if(0 !== a.charCodeAt(u))
                        {
                            s = u;
                            break;
                        }
                    return a = 0 <= s ? a.substr(0, u + 1) : "";
                }
                t = 0;
            }
    switch(f)
    {
        case "str":
            i = e.len + 2 <= e.length ? e[e.len] + 256 * e[e.len + 1] : 0, e.len += 2;
            var o = e.slice(e.len, e.len + i);
            a = Utf8ArrayToStr(o), e.len += i;
            break;
        case "byte":
            a = e.len + 1 <= e.length ? e[e.len] : 0, e.len += 1;
            break;
        case "double":
            a = e.len + 8 <= e.length ? e.readDoubleLE(e.len, 8) : 0, e.len += 8;
            break;
        case "uint":
            a = e.len + 6 <= e.length ? e.readUIntLE(e.len, 6) : 0, e.len += 6;
            break;
        case "uint16":
            a = e.len + 2 <= e.length ? e[e.len] + 256 * e[e.len + 1] : 0, e.len += 2;
            break;
        case "uint32":
            a = e.len + 4 <= e.length ? e.readUInt32LE(e.len, 4) : 0, e.len += 4;
            break;
        case "time":
            if(l)
                throw "Bad read type params: time - DisableTime ON";
            a = e.len + 6 <= e.length ? e.readUIntLE(e.len, 6) : 0, a = new Date(a), e.len += 6;
            break;
        case "addres":
        case "hash":
            a = [];
            for(u = 0; u < 32; u++)
                e.len + u <= e.length ? a[u] = e[e.len + u] : a[u] = 0;
            e.len += 32;
            break;
        case "buffer":
        case "arr":
            a = e.len + t <= e.length ? e.slice(e.len, e.len + t) : Buffer.alloc(t), e.len += t;
            break;
        case "tr":
            if(e.len + 1 >= e.length)
            {
                a = void 0;
                break;
            }
            i = e[e.len] + 256 * e[e.len + 1];
            e.len += 2, a = e.slice(e.len, e.len + i), e.len += i;
            break;
        case "data":
            (i = e.len + 4 <= e.length ? e.readUInt32LE(e.len, 4) : 0) > e.length - e.len - 4 && (i = 0), e.len += 4, a = e.slice(e.len,
            e.len + i), e.len += i;
            break;
        case "hashSTR":
            var b = e.toString("utf8", e.len, e.len + 64);
            a = GetAddresFromHex(b), e.len += 64;
            break;
        case "uintSTR":
            b = e.toString("utf8", e.len, e.len + 10);
            a = parseInt(b), e.len += 10;
            break;
        default:
            n = n || {};
            var d = f.substr(0, 1);
            if("[" === d)
            {
                a = [];
                var c = GetMiddleString(f);
                for(i = Read(e, "uint32"), u = 0; u < i && e.len <= e.length; u++)
                    a[u] = Read(e, c, void 0, n, l);
            }
            else
            {
                if("{" !== d)
                    throw "Bad read type params: " + f;
                var h = n[f];
                h || (h = GetAttributes(GetMiddleString(f)), n[f] = h), a = {};
                for(u = 0; u < h.length; u++)
                {
                    var g = h[u];
                    a[g.Key] = Read(e, g.Value, void 0, n, l);
                }
            }
    }
    return a;
};

function BufWriteByte(e)
{
    this[this.len] = e, this.len += 1;
};

function BufWrite(e,r,t)
{
    Write(this, e, r, t);
};

function BufRead(e,r)
{
    return Read(this, e, r);
};

function GetNewBuffer(e)
{
    var r = Buffer.alloc(e);
    return r.Read = BufRead.bind(r), r.Write = BufWrite.bind(r), r.len = 0, r;
};

function GetReadBuffer(e)
{
    var r = Buffer.from(e);
    return r.Read = BufRead.bind(r), r.Write = BufWrite.bind(r), r.len = 0, r;
};

function GetObjectFromBuffer(e,r,t,n)
{
    var l = Buffer.from(e);
    return l.len = 0, Read(l, r, void 0, t, n);
};

function GetBufferFromObject(e,r,t,n,l)
{
    var a = Buffer.alloc(t);
    return a.len = 0, Write(a, e, r, void 0, n), l || (a = a.slice(0, a.len)), a;
};

function GetMiddleString(e)
{
    return e.substr(1, e.length - 2);
};

function GetMiddleString2(e,r,t)
{
    for(var n = 0, l = "", a = 0; a < e.length; a++)
    {
        var f = e.substr(a, 1);
        if(" " !== f && "\n" !== f && (f !== r || 1 != ++n))
        {
            if(f === t && 0 === --n)
                break;
            n && (l += f);
        }
    }
    return l;
};

function GetAttributeStrings(e)
{
    for(var r = 0, t = [], n = "", l = 0; l < e.length; l++)
    {
        var a = e.substr(l, 1);
        if("{" === a)
            r++;
        else
            if("}" === a)
                r--;
            else
            {
                if("," === a && 0 === r)
                {
                    0 < n.length && t.push(n), n = "";
                    continue;
                }
                if(" " === a || "\n" === a)
                    continue;
            }
        n += a;
    }
    return 0 < n.length && t.push(n), t;
};

function GetKeyValueStrings(e)
{
    for(var r = "", t = 0; t < e.length; t++)
    {
        var n = e.substr(t, 1);
        if(" " !== n && "\n" !== n)
        {
            if(":" === n)
                return {Key:r, Value:e.substr(t + 1)};
            r += n;
        }
    }
    throw "Error format Key:Value = " + e;
};

function GetAttributes(e)
{
    for(var r = [], t = GetAttributeStrings(e), n = 0; n < t.length; n++)
    {
        var l = GetKeyValueStrings(t[n]);
        r.push(l);
    }
    return r;
};
module.exports.GetNewBuffer = GetNewBuffer, module.exports.GetReadBuffer = GetReadBuffer, module.exports.alloc = GetNewBuffer,
module.exports.from = GetReadBuffer, module.exports.Write = Write, module.exports.Read = Read, module.exports.GetObjectFromBuffer = GetObjectFromBuffer,
module.exports.GetBufferFromObject = GetBufferFromObject;
