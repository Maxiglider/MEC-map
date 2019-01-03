//TESH.scrollpos=21
//TESH.alwaysfold=0
library TerrainTypeGrass needs TerrainTypeMax


function TerrainTypeGrassId2MaxId takes integer grassId returns integer
	//! textmacro TerrainTypeGrassId2MaxId takes grassId, maxId
	if (grassId == $grassId$) then
		return $maxId$
	endif
	//! endtextmacro
	
	//! runtextmacro TerrainTypeGrassId2MaxId( "1", "5" )
	//! runtextmacro TerrainTypeGrassId2MaxId( "2", "11" )
	//! runtextmacro TerrainTypeGrassId2MaxId( "3", "12" )
	//! runtextmacro TerrainTypeGrassId2MaxId( "4", "17" )
	//! runtextmacro TerrainTypeGrassId2MaxId( "5", "26" )
	//! runtextmacro TerrainTypeGrassId2MaxId( "6", "29" )
	//! runtextmacro TerrainTypeGrassId2MaxId( "7", "40" )
	//! runtextmacro TerrainTypeGrassId2MaxId( "8", "45" )
	//! runtextmacro TerrainTypeGrassId2MaxId( "9", "55" )
	//! runtextmacro TerrainTypeGrassId2MaxId( "10", "63" )
	//! runtextmacro TerrainTypeGrassId2MaxId( "11", "65" )
	//! runtextmacro TerrainTypeGrassId2MaxId( "12", "71" )
	//! runtextmacro TerrainTypeGrassId2MaxId( "13", "73" )
	//! runtextmacro TerrainTypeGrassId2MaxId( "14", "80" )
	//! runtextmacro TerrainTypeGrassId2MaxId( "15", "106" )
	//! runtextmacro TerrainTypeGrassId2MaxId( "16", "107" )
	//! runtextmacro TerrainTypeGrassId2MaxId( "17", "139" )

    return 0
endfunction


function TerrainTypeMaxId2GrassId takes integer maxId returns integer
	//! textmacro TerrainTypeMaxId2GrassId takes grassId, maxId
	if (maxId == $maxId$) then
		return $grassId$
	endif
	//! endtextmacro
	
	//! runtextmacro TerrainTypeMaxId2GrassId( "1", "5" )
	//! runtextmacro TerrainTypeMaxId2GrassId( "2", "11" )
	//! runtextmacro TerrainTypeMaxId2GrassId( "3", "12" )
	//! runtextmacro TerrainTypeMaxId2GrassId( "4", "17" )
	//! runtextmacro TerrainTypeMaxId2GrassId( "5", "26" )
	//! runtextmacro TerrainTypeMaxId2GrassId( "6", "29" )
	//! runtextmacro TerrainTypeMaxId2GrassId( "7", "40" )
	//! runtextmacro TerrainTypeMaxId2GrassId( "8", "45" )
	//! runtextmacro TerrainTypeMaxId2GrassId( "9", "55" )
	//! runtextmacro TerrainTypeMaxId2GrassId( "10", "63" )
	//! runtextmacro TerrainTypeMaxId2GrassId( "11", "65" )
	//! runtextmacro TerrainTypeMaxId2GrassId( "12", "71" )
	//! runtextmacro TerrainTypeMaxId2GrassId( "13", "73" )
	//! runtextmacro TerrainTypeMaxId2GrassId( "14", "80" )
	//! runtextmacro TerrainTypeMaxId2GrassId( "15", "106" )
	//! runtextmacro TerrainTypeMaxId2GrassId( "16", "107" )
	//! runtextmacro TerrainTypeMaxId2GrassId( "17", "139" )

    return 0
endfunction


function TerrainTypeGrassId2TerrainTypeId takes integer grassId returns integer
    return TerrainTypeMaxId2TerrainTypeId(TerrainTypeGrassId2MaxId(grassId))
endfunction



endlibrary