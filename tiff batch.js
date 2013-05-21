/**
 Batch tiff processor Macro for ImageJ
*/

macro "Batch Tiff Enhancement"
{
	sourceDir = getDirectory("Choose Source Directory ");
	fileList = getFileListRecursive(sourceDir);
	desinationDir = getDirectory("Choose Destination Directory");

	run("Bio-Formats Macro Extensions");
	setBatchMode(true);
 
	for (i=0; i<fileList.length; i++)
	{
		if(!endsWith(fileList[i],"/"))
		{
			if(endsWith(fileList[i],".imagej")) //use .tif 
			{
				 showProgress(i + 1, fileList.length);
				 filePath = sourceDir + fileList[i];
				 open(filePath);
				 //openFile(filePath);
				 
				if(getSliceNumber() > 1)
				{
					Stack.getDimensions(width, height, channels, slices, frames);
					for(f = 1; f < frames+1;f++)
					{
						Stack.setFrame(f);
						
						for(s=1; s < slices+1;s++)
						{
							Stack.setSlice(s);
							mainEnhancementToCurrentSlice();
						}
					}  
				}
				else
				{
					mainEnhancement();	
				}
				
				saveAs("TIFF", desinationDir + fileList[i]);
				close();
			}
		}
		else
		{
			File.makeDirectory(desinationDir + fileList[i]);
		}
		
	}

	showStatus("Finished.");
	setBatchMode(false);

	
	function mainEnhancement()
	{
		run("Make Binary"); 
		run("Close-");
		run("Dilate");
		run("Close-");
	}
	
	function mainEnhancementToCurrentSlice()
	{
		run("Make Binary","slice"); 
		run("Close-","slice");
		run("Dilate","slice");
		run("Close-","slice");
	}
	
	function getFileListRecursive(dir1)
	{		
		xlist =  getFileList(dir1);
		firstlength = xlist.length;
		
		for (i=0; i<firstlength ; i++) 
		{
				if(endsWith(xlist[i],"/"))
				{
					a = "/";
					b = dir1 +  a +  xlist[i];

					subList =  getFileListRecursive(b);
					newSubList = newArray(subList.length);

					for(x=0; x < subList.length; x ++)
					{
						newSubList[x] = xlist[i] + subList[x];
					}

					xlist = Array.concat(xlist,newSubList);
				}
		}
		
		return xlist;
	}
		
	function saveFile(outFile) 
	{
		   run("Bio-Formats Exporter", "save=[" + outFile + "] compression=Uncompressed");
	}
}