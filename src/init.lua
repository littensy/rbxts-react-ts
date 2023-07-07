local Packages = script.Parent :: any

local React = require(Packages.React)
local RoactCompat = require(Packages.RoactCompat)

local exports = table.clone(React)

for key, value in RoactCompat do
	exports[key] = value
end

return exports
