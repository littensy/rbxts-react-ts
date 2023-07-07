local React = require(script.Parent.React)
local RoactCompat = require(script.Parent.RoactCompat)

local exports = {}

for key, value in React do
	exports[key] = value
end

for key, value in RoactCompat do
	exports[key] = value
end

return exports
