local strings = {}

local function escape_literal(s)
  return s:gsub("([^%w])", "%%%1")
end


function strings.replaceAll(toReplace, replacement, str)
  if not toReplace or toReplace == "" then
    return str
  end
  local pattern = escape_literal(toReplace)
  local result = str:gsub(pattern, function() return replacement end)
  return result
end

function strings.escapeDoubleQuotes(str)
  return strings:replaceAll("\"", "\\\"", str)
end

function strings.replaceBackslahsesInLinks(str)
    return str:gsub("\\+", "/")
end

function strings.stringContainsChar(str, char)
  return str:find(char, 1, true) ~= nil
end

return strings